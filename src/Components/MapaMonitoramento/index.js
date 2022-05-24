
import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Button from '@mui/material/Button';
import api from '../../services/api';

const Monitoramento = () => {
    const [ connection, setConnection ] = useState(null);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:44349/monitoramentoHub')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');
                    
                    connection.on('receiveMessage', message => {
                        setLocations((locations) => {
                            return [...locations, message]
                        })
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const gerarNotificacao = () => {
        const retorno = (result) => {
            console.log("sucesso geração da notificação", result)
        }

        const erroRetorno = (error) => {
            console.log("erro aqui",error)
        }
        api.post("https://localhost:44349/monitoramento/receber",{
            latitude: "teste123213",
            longitude: "oitetste123"
        }).then(retorno).catch(erroRetorno)
    }

    return (
        <>
            <div>
                <Button onClick={gerarNotificacao}> Gerar notificacao</Button>
            </div>
            {locations.map((loc) => {
                return(
                    <div>
                        <div>{loc?.latitude}</div>
                        <div>{loc?.longitude}</div>
                    </div>
                )
            })}
            
        </>
    );
};

export default Monitoramento;