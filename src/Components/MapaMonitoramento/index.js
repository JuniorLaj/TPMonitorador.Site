
import React, { useState, useEffect, useCallback, useMemo  } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Button from '@mui/material/Button';
import api from '../../services/api';
import {Map} from 'pigeon-maps';
import Marker from 'pigeon-marker';

const getProvider = (x, y, z) => `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;


const Monitoramento = () => {

    const mapConfig = {
        center: [-19.8272144, -43.1629986],
        zoom: 16
    };

    
    const data = {
        name: '3',
        values: [-19.8245789, -43.1620343],
    }

    const [ connection, setConnection ] = useState(null);
    const [locations, setLocations] = useState([
        {
            name: '0',
            values: [-19.8272083, -43.1629873],
        },
        {
            name: '1',
            values: [-19.8267341, -43.1629907],
        },
        {
            name: '2',
            values: [-19.8267341, -43.1629907],
        },
]);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://topmonitorador-api.herokuapp.com/monitoramentoHub')
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
        setLocations((locations) => {
            debugger
            return [...locations, data]
        })
    }
    
    const PigeonMarkers = useCallback(() => {
        return (
            locations.map(marker => (
                <Marker
                    key={`marker_${marker.name}`}
                    anchor={marker.values}
                    payload={marker.name}
                    onClick={() => {}}
                />
                )
            )
        )
    },[locations]);

    return (
    <>
        <div>
            <Button onClick={gerarNotificacao}> Gerar notificacao</Button>
        </div>
        <div className="map">
            <Map
                width={window.innerWidth}
                height={600}
                defaultCenter={mapConfig.center}
                defaultZoom={mapConfig.zoom}
                provider={getProvider}
            >
                {PigeonMarkers()}
            </Map>
        </div>
            
    </>
    );
};

export default Monitoramento;