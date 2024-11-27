import '../App.css'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodRideEstimateForm } from '../lib/utils';
import axios from 'axios';
import { useState } from "react";
import { useRideContext } from '../contexts/RideContext'
import { Link, useNavigate } from 'react-router-dom'
import { RideEstimate } from '../interfaces/RideInterfaces'
import { TRideEstimate } from '../types/RideTypes'

function RideEstimatePage() {
    const [requestInvalidData, setRequestInvalidData] = useState<boolean>(false);
    const { setRideEstimate, setRideConfirm, rideConfirm } = useRideContext();
    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        formState: { isSubmitting, errors },
    } = useForm<TRideEstimate>({
        resolver: zodResolver(ZodRideEstimateForm),
    });

    const handleSubmitRide = async (data: TRideEstimate) => {
        setRequestInvalidData(false)
        axios.post("http://localhost:8080/ride/estimate", {
            customer_id: data.customer_id,
            origin: data.origin,
            destination: data.destination
        })
            .then((response) => {
                const rideEst = response.data as RideEstimate;
                setRideConfirm({
                    customer_id: data.customer_id,
                    origin: data.origin,
                    destination: data.destination,
                    distance: rideEst.distance,
                    duration: rideEst.duration,
                    driver: {
                        id: 0,
                        name: ""
                    },
                    value: 0
                });
                setRideEstimate(rideEst);
                navigate("/ride/confirm");
            })
            .catch(() => setRequestInvalidData(true));
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Qual o seu ponto de partida e destino?</CardTitle>
                <CardDescription>Local inicial, onde a viagem vai iniciar e terminar.</CardDescription>
                {requestInvalidData && <h3 className="text-sm text-red-500">Erro na confirmação da viagem: Ponto de origem e/ou destino é inválido.</h3>}
            </CardHeader>
            <form autoComplete="off" onSubmit={handleSubmit(handleSubmitRide)} method="POST">
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="customer_id">* ID do cliente</Label>
                            {errors.customer_id && <span className="text-sm text-red-500">{errors.customer_id?.message}</span>}
                            <Input type="number" id="customer_id" placeholder="ID do cliente" defaultValue={rideConfirm?.customer_id} {...register("customer_id")} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="origin">* Origem</Label>
                            {errors.origin && <span className="text-sm text-red-500">{errors.origin?.message}</span>}
                            <Input type="text" id="origin" placeholder="Ponto de origem" defaultValue={rideConfirm?.origin} {...register("origin")} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="destination">* Destino</Label>
                            {errors.destination && <span className="text-sm text-red-500">{errors.destination?.message}</span>}
                            <Input type="text" id="destination" placeholder="Ponto de destino" defaultValue={rideConfirm?.destination} {...register("destination")} />
                            {(errors as any)?.confirm && <span className="text-sm text-red-500">{(errors as any)?.confirm?.message}</span>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className="flex gap-3">
                        <Button variant="outline" type="reset">Limpar</Button>
                        <Link to={"/ride/history"}><Button variant="outline" type="reset">Histórico</Button></Link>
                    </div>
                    <Button type="submit" disabled={isSubmitting}>Buscar</Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default RideEstimatePage;