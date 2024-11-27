import '../App.css'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { useForm, UseFormSetValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodRideConfirmForm } from '../lib/utils';
import axios from 'axios';
import { useRideContext } from '../contexts/RideContext'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import { DriverTable } from '../components/RideConfirm/DriverTable'
import { TRideConfirm } from '../types/RideTypes'

function RideConfirmPage() {
    const [requestInvalidData, setRequestInvalidData] = useState<boolean>(false);
    const [requestDriverNotFound, setRequestDriverNotFound] = useState<boolean>(false);
    const [requestInvalidDistance, setRequestInvalidDistance] = useState<boolean>(false);
    const [requestMapError, setMapError] = useState<boolean>(false);
    const [staticMapUrl, setStaticMapUrl] = useState<string>("");
    const { setRideEstimate, rideEstimate, setRideConfirm, rideConfirm } = useRideContext();
    const navigate = useNavigate();
    const {
        handleSubmit,
        setValue,
        getValues,
        formState: { isSubmitting, errors },
    } = useForm<TRideConfirm>({
        resolver: zodResolver(ZodRideConfirmForm),
    });

    const handleSubmitRide = async (data: TRideConfirm) => {
        setRequestInvalidData(false);
        setRequestDriverNotFound(false);
        setRequestInvalidDistance(false);
        axios.patch("http://localhost:8080/ride/confirm", {
            customer_id: data.customer_id,
            origin: data.origin,
            destination: data.destination,
            distance: data.distance,
            duration: data.duration,
            driver: {
                id: data.driver_id,
                name: data.driver_name
            },
            value: data.value
        })
            .then(() => {
                navigate("/ride/history");
            })
            .catch((e) => {
                if (e.error_code == "INVALID_DATA") {
                    setRequestInvalidData(true)
                } else if (e.error_code == "DRIVER_NOT_FOUND") {
                    setRequestDriverNotFound(true)
                } else if (e.error_code == "INVALID_DISTANCE") {
                    setRequestInvalidDistance(true)
                }
            });
    }

    useEffect(() => {
        if (rideEstimate && rideConfirm) {
            if (rideConfirm.customer_id && rideConfirm.origin && rideConfirm.destination) {
                setValue("customer_id", rideConfirm.customer_id);
                setValue("origin", rideConfirm.origin);
                setValue("destination", rideConfirm.destination);
                setValue("distance", rideConfirm.distance);
                setValue("duration", rideConfirm.duration);
            }
            axios.post("http://localhost:8080/static/map", {
                origin: rideConfirm.origin,
                destination: rideConfirm.destination
            })
                .then((response: any) => {
                    setStaticMapUrl(response.data);
                })
                .catch(() => setMapError(true));
        } else {
            navigate("/");
        }
    }, [])

    return (
        <Card className="w-[900px]">
            <form autoComplete="off" onSubmit={handleSubmit(handleSubmitRide)} method="POST">
                <CardHeader>
                    <CardTitle>Sua viagem está proxima de acontecer!</CardTitle>
                    <CardDescription>Veja a lista de motoristas disponíveis abaixo: </CardDescription>
                    {requestInvalidData && <h3 className="text-sm text-red-500">Erro na confirmação da viagem: os dados fornecidos no formulário são inválidos.</h3>}
                    {requestDriverNotFound && <h3 className="text-sm text-red-500">Erro na confirmação da viagem: o motorista selecionado não foi encontrado.</h3>}
                    {requestInvalidDistance && <h3 className="text-sm text-red-500">Erro na confirmação da viagem: a distância mínima necessária para o motorista selecionado não foi atendida.</h3>}
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="bg-white">Informações da viagem</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid w-full items-center gap-4 mt-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="customer_id">ID do cliente</Label>
                                        <Input disabled={true} type="number" id="customer_id" placeholder="ID do cliente" value={rideConfirm?.customer_id} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="origin">Origem</Label>
                                        <Input disabled={true} type="text" id="origin" placeholder="Ponto de origem" value={rideConfirm?.origin} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="destination">Destino</Label>
                                        <Input disabled={true} type="text" id="destination" placeholder="Ponto de destino" value={rideConfirm?.destination} />
                                    </div>
                                    <Link to={"/"}><Button variant="outline" className="text-black">Editar</Button></Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <div className="flex flex-col space-y-1.5 mt-4">
                        <iframe
                            src={staticMapUrl}
                            width="100%"
                            height="600"
                            style={{ border: 0 }}
                            loading="lazy">
                        </iframe>
                    </div>
                    {
                        rideEstimate ? <DriverTable setValue={setValue as UseFormSetValue<TRideConfirm>} /> : <h3 className="text-sm text-red-500 mt-3">Tabela fora do ar!</h3>
                    }
                </CardContent>
                {errors.driver_id && <span className="text-sm text-red-500">Selecione um motorista!</span>}
                <CardFooter className="flex justify-between">
                    <Button onClick={() => {
                        setRideEstimate(null);
                        setRideConfirm(null);
                        navigate("/");
                    }} variant="outline">Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>Confirmar</Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default RideConfirmPage;