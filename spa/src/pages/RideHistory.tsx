import '../App.css'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodRideHistoryForm } from '../lib/utils';
import axios from 'axios';
import { useRideContext } from '../contexts/RideContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TRideHistory } from '../types/RideTypes'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/ui/select'
import { RideHistory } from '../interfaces/RideInterfaces'
import { HistoryTable } from '../components/RideHistory/HistoryTable'

function RideHistoryPage() {
    const [requestInvalidDriver, setRequestInvalidDriver] = useState<boolean>(false);
    const [requestNoRidesFound, setRequestNoRidesFound] = useState<boolean>(false);

    const [drivers, setDrivers] = useState<any[]>([]);
    const { setRideEstimate, setRideHistory, rideHistory } = useRideContext();
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm<TRideHistory>({
        resolver: zodResolver(ZodRideHistoryForm),
    });

    useEffect(() => {
        setValue("driver_id", "empty");
        axios.get("http://localhost:8080/drivers")
            .then((response: any) => {
                setDrivers(response.data);
            })
    }, [])

    const handleSubmitRide = async (data: TRideHistory) => {
        setRequestInvalidDriver(false)
        setRequestNoRidesFound(false);

        var url = "http://localhost:8080/ride/" + data?.customer_id;
        if (data.driver_id && data.driver_id != "empty") {
            url = "http://localhost:8080/ride/" + data?.customer_id + "?driver_id=" + data.driver_id
        }
        axios.get(url)
            .then((response) => {
                const data = response.data as RideHistory;
                setRideHistory(data);
            })
            .catch((e) => {
                const error_data = e.response.data;
                if (error_data.error_code == "INVALID_DRIVER") {
                    setRequestInvalidDriver(true)
                } else if (error_data.error_code == "NO_RIDES_FOUND") {
                    setRequestNoRidesFound(true)
                }
            });
    }

    return (
        <Card className="w-[900px]">
            <form autoComplete="off" onSubmit={handleSubmit(handleSubmitRide)} method="POST">
                <CardHeader>
                    <CardTitle>Veja seu histórico de viagem!</CardTitle>
                    <CardDescription>Com base nas informações da viagem, filtre a lista abaixo:</CardDescription>
                    {requestInvalidDriver && <h3 className="text-sm text-red-500">Erro na busca do histórico: motorista inválido.</h3>}
                    {requestNoRidesFound && <h3 className="text-sm text-red-500"> Erro na busca do histórico: não há histórico.</h3>}
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4 mt-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="customer_id">ID do cliente</Label>
                            {errors.customer_id && <span className="text-sm text-red-500">{errors.customer_id?.message}</span>}
                            <Input type="number" id="customer_id" placeholder="ID do cliente" {...register("customer_id")} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Select defaultValue="empty" onValueChange={(value) => setValue("driver_id", value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Selecione um motorista" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Motoristas</SelectLabel>
                                        <SelectItem value="empty">Nenhum motorista</SelectItem>
                                        {
                                            drivers?.map((driver) => {
                                                return <SelectItem key={driver.id} value={`${driver.id}`}><b>Nome: </b>{driver.nome}, <b>Veículo</b> {driver.carro}, <b>Avaliação: </b> {driver.avaliacao}</SelectItem>
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {
                        rideHistory && <HistoryTable />
                    }
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={() => {
                        setRideEstimate(null);
                        setRideHistory(null);
                        navigate("/");
                    }} variant="outline">Voltar ao inicio</Button>
                    <Button type="submit" disabled={isSubmitting}>Buscar</Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default RideHistoryPage;