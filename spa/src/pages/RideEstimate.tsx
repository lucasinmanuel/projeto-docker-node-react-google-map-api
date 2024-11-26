import '../App.css'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodRideEstimateForm } from '../lib/utils';
import axios from 'axios';
import { useLayoutEffect, useRef, useState } from "react";
import { Autocomplete, Libraries, LoadScript } from "@react-google-maps/api";
import { useRideContext } from '../contexts/RideContext'
import { useNavigate } from 'react-router-dom'
import { RideEstimate } from '../interfaces/RideInterfaces'
import { TRideEstimate } from '../types/RideTypes'


const googleLibraries: Libraries = ['places'];

function RideEstimatePage() {
    const [requestError, setRequestError] = useState<boolean>(false);
    const { googleApiKey, setGoogleApiKey, setRideEstimate, rideEstimate } = useRideContext();
    const navigate = useNavigate();
    useLayoutEffect(() => {
        async function getApiKey() {
            const { data } = await axios.get("http://localhost:8080/google/key");
            setGoogleApiKey(data);
        }
        getApiKey();
    }, []);

    const originAddressRef: any = useRef(null);

    const handleOriginAutocomplete = async () => {
        const place: google.maps.places.PlaceResult = originAddressRef.current.getPlace();
        if (place.formatted_address) {
            setValue("origin", place.formatted_address);
        }
    }

    const destinationAddressRef: any = useRef(null);

    const handleDestinationAutocomplete = () => {
        const place: google.maps.places.PlaceResult = destinationAddressRef.current.getPlace();
        if (place.formatted_address) {
            setValue("destination", place.formatted_address);
        }
    }

    const {
        handleSubmit,
        register,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm<TRideEstimate>({
        resolver: zodResolver(ZodRideEstimateForm),
    });

    const handleSubmitRide = async (data: TRideEstimate) => {
        setRequestError(false)
        axios.post("http://localhost:8080/ride/estimate", {
            customer_id: data.customer_id,
            origin: data.origin,
            destination: data.destination
        })
            .then((response) => {
                const rideEst = response.data as RideEstimate;
                rideEst.customer_id = data.customer_id;
                rideEst.origin_name = data.origin;
                rideEst.destination_name = data.destination;
                setRideEstimate(response.data);
                navigate("/ride/confirm");
                console.log(response)
            })
            .catch(() => setRequestError(true));
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Qual o seu ponto de partida e destino?</CardTitle>
                <CardDescription>Local inicial, onde a viagem vai iniciar e terminar.</CardDescription>
                {requestError && <h3 className="text-sm text-red-500">Erro na estimativa da viagem (Ponto de origem ou destino inválido)</h3>}
            </CardHeader>
            <form autoComplete="off" onSubmit={handleSubmit(handleSubmitRide)} method="POST">
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="customer_id">* ID do cliente</Label>
                            {errors.customer_id && <span className="text-sm text-red-500">{errors.customer_id?.message}</span>}
                            <Input type="number" id="customer_id" placeholder="ID do cliente" defaultValue={rideEstimate?.customer_id} {...register("customer_id", { valueAsNumber: true })} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="origin">* Origem</Label>
                            {errors.origin && <span className="text-sm text-red-500">{errors.origin?.message}</span>}
                            {googleApiKey ? (
                                <LoadScript googleMapsApiKey={googleApiKey} libraries={googleLibraries}>
                                    <Autocomplete
                                        onLoad={(ref) => (originAddressRef.current = ref)}
                                        onPlaceChanged={handleOriginAutocomplete}
                                    >
                                        <Input type="text" id="origin" placeholder="Ponto de origem" defaultValue={rideEstimate?.origin_name} {...register("origin")} />
                                    </Autocomplete>
                                </LoadScript>
                            ) : (
                                <Input type="text" id="origin" placeholder="Ponto de origem" defaultValue={rideEstimate?.origin_name} {...register("origin")} />
                            )}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="destination">* Destino</Label>
                            {errors.destination && <span className="text-sm text-red-500">{errors.destination?.message}</span>}
                            {googleApiKey ? (
                                <LoadScript googleMapsApiKey={googleApiKey} libraries={googleLibraries}>
                                    <Autocomplete
                                        onLoad={(ref) => (destinationAddressRef.current = ref)}
                                        onPlaceChanged={handleDestinationAutocomplete}
                                    >
                                        <Input type="text" id="destination" placeholder="Ponto de destino" defaultValue={rideEstimate?.destination_name} {...register("destination")} />
                                    </Autocomplete>
                                </LoadScript>
                            ) : (
                                <Input type="text" id="destination" placeholder="Ponto de destino" defaultValue={rideEstimate?.destination_name} {...register("destination")} />
                            )}
                            {(errors as any)?.confirm && <span className="text-sm text-red-500">{(errors as any)?.confirm?.message}</span>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="reset">Limpar</Button>
                    <Button type="submit" disabled={isSubmitting}>Buscar</Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default RideEstimatePage;