CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    carro VARCHAR(255),
    avaliacao NUMERIC CHECK (avaliacao >= 0 AND avaliacao <= 5),
    comentarios TEXT,
    taxa_km NUMERIC,
    km_minimo NUMERIC
);

INSERT INTO drivers (id, nome, descricao, carro, avaliacao, comentarios, taxa_km, km_minimo) VALUES
(1, 'Homer Simpson', 
 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).', 
 'Plymouth Valiant 1973 rosa e enferrujado', 
 2, 
 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.', 
 2.50, 
 1.00),

(2, 'Dominic Toretto', 
 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.', 
 'Dodge Charger R/T 1970 modificado', 
 4, 
 'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!', 
 5.00, 
 5.00),

(3, 'James Bond', 
 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.', 
 'Aston Martin DB5 clássico', 
 5, 
 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.', 
 10.00, 
 10.00);

CREATE TABLE rides (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    distance NUMERIC NOT NULL,
    duration TEXT NOT NULL,
    driver_id INT NOT NULL,
    driver_name TEXT NOT NULL,
    ride_value NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);