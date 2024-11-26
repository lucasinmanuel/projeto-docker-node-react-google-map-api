import { Router } from "express";
import { rideEstimate } from "./controllers/ride.js";
import googleApiKey from "./controllers/googleApiKey.js";
import placeAutocomplete from "./controllers/placeAutoComplete.js";
import staticMap from "./controllers/staticMap.js";

const router = Router();

/* POST /ride/estimate */
//Responsável por receber a origem e o destino da viagem e realizar os
//cálculos dos valores da viagem.

router.get('/google/key', googleApiKey as any)

router.post('/place/autocomplete', placeAutocomplete as any)
router.post('/static/map', staticMap as any)
router.post('/ride/estimate', rideEstimate as any);

//router.get('/pokemon/:id',pokemons.getPokemonById)
//router.post('/user',users.postUser);
//router.post('/login',users.login);
//router.post('/pokemon',pokemons.postPokemon);
//router.patch('/pokemon/:id',pokemons.patchNickname);
//router.delete('/pokemon/:id',pokemons.removePokemon);

export default router;