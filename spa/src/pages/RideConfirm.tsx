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
import { GoogleMap, Libraries, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api'
import { Link, useNavigate } from 'react-router-dom'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import { DriverTable } from '../components/RideConfirm/DriverTable'
import { TRideConfirm } from '../types/RideTypes'

const googleLibraries: Libraries = ['places'];

function RideConfirmPage() {
    const [requestError, setRequestError] = useState<boolean>(false);
    const { googleApiKey, rideEstimate, selectedDriver } = useRideContext();
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        setValue,
        getValues,
        formState: { isSubmitting, errors },
    } = useForm<TRideConfirm>({
        resolver: zodResolver(ZodRideConfirmForm),
    });

    const handleSubmitRide = async (data: TRideConfirm) => {
        setRequestError(false)

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
            .then((response) => {
                console.log(response)
            })
            .catch(() => setRequestError(true));
    }

    const [originLatLng, setOriginLatLng] = useState<{ lat: number, lng: number }>();
    const [destinationLatLng, setDestinationLatLng] = useState<{ lat: number, lng: number }>();

    useEffect(() => {
        if (rideEstimate) {
            setOriginLatLng({
                lat: rideEstimate?.origin.latitude,
                lng: rideEstimate?.origin.longitude
            })
            setDestinationLatLng({
                lat: rideEstimate?.destination.latitude,
                lng: rideEstimate?.destination.longitude
            })
            if (rideEstimate.customer_id && rideEstimate.origin_name && rideEstimate.destination_name) {
                setValue("customer_id", rideEstimate.customer_id);
                setValue("origin", rideEstimate.origin_name);
                setValue("destination", rideEstimate.destination_name);
                setValue("distance", rideEstimate.distance);
                setValue("duration", rideEstimate.duration);
            }
        }
    }, [])

    const [isDirectionsRequested, setIsDirectionsRequested] = useState(false);

    useEffect(() => {
        if (originLatLng && destinationLatLng && !isDirectionsRequested) {
            setIsDirectionsRequested(true);
        }
    }, [originLatLng, destinationLatLng, isDirectionsRequested]);

    const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);
    const [directionsError, setDirectionsError] = useState<google.maps.DirectionsStatus | null>(null);

    return (
        <Card className="w-[900px]">
            <form autoComplete="off" onSubmit={handleSubmit(handleSubmitRide)} method="POST">
                <CardHeader>
                    <CardTitle>Sua viagem está proxima de acontecer!</CardTitle>
                    <CardDescription>Veja a lista de motoristas disponíveis abaixo: </CardDescription>
                    {requestError && <h3 className="text-sm text-red-500">Erro na confirmação da viagem (???)</h3>}
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="bg-white">Informações da viagem</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid w-full items-center gap-4 mt-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="customer_id">ID do cliente</Label>
                                        <Input disabled={true} type="number" id="customer_id" placeholder="ID do cliente" value={rideEstimate?.customer_id} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="origin">Origem</Label>
                                        <Input disabled={true} type="text" id="origin" placeholder="Ponto de origem" value={rideEstimate?.origin_name} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="destination">Destino</Label>
                                        <Input disabled={true} type="text" id="destination" placeholder="Ponto de destino" value={rideEstimate?.destination_name} />
                                    </div>
                                    <Link to={"/"}><Button variant="outline" className="text-black">Editar</Button></Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <div className="flex flex-col space-y-1.5 mt-4">
                        {directionsError && <span className="text-sm text-red-500">{directionsError}</span>}
                        {googleApiKey ?
                            (
                                <LoadScript googleMapsApiKey={googleApiKey} libraries={googleLibraries}>
                                    <GoogleMap mapContainerStyle={{ width: '100%', height: '600px' }} center={originLatLng} zoom={19}>
                                        {
                                            isDirectionsRequested && (
                                                <DirectionsService callback={(result, status) => {
                                                    if (status === "OK" && result) {
                                                        setDirectionsResult(result);
                                                    } else {
                                                        setDirectionsError(status);
                                                        console.error("Erro ao buscar direções:", status);
                                                    }
                                                }
                                                } options={{
                                                    origin: destinationLatLng as any,
                                                    destination: destinationLatLng as any,
                                                    travelMode: google.maps.TravelMode.DRIVING,
                                                }} />
                                            )
                                        }
                                        {directionsResult && <DirectionsRenderer directions={directionsResult} />}
                                    </GoogleMap>
                                </LoadScript>
                            ) : <h3 className="text-sm text-red-500">Mapa fora do ar!</h3>
                        }
                    </div>
                    {
                        rideEstimate ? <DriverTable setValue={setValue as UseFormSetValue<TRideConfirm>} /> : <h3 className="text-sm text-red-500 mt-3">Tabela fora do ar!</h3>
                    }
                </CardContent>
                {errors.driver_id && <span className="text-sm text-red-500">Selecione um motorista!</span>}
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>Confirmar</Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default RideConfirmPage;