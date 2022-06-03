
import React, { useState, useEffect, useCallback  } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import {Map} from 'pigeon-maps';
import Marker from 'pigeon-marker';

const getProvider = (x, y, z) => `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;


const Monitoramento = () => {


    const [mapConfig, setMapConfig] = useState({
        center: [-19.8272144, -43.1629986],
        zoom: 16
    });
    const [ connection, setConnection ] = useState(null);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://topmonitorador-api.herokuapp.com/monitoramentoHub')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection && connection?._connectionState !== "Connected") {
            connection.start()
                .then(result => {
                    console.log('Connected!');
                    
                    connection.on('receiveMessage', message => {
                        const latitude = Number(message.latitude)
                        const longitude = Number(message.longitude)

                        if(locations.length === 0) {
                            setMapConfig((mapConfig) => {
                                mapConfig.center = [latitude, longitude]
                                return Object.assign({}, mapConfig);
                            })
                        }
                        setLocations((locations) => {
                            return [...locations, {
                                values : [latitude, longitude],
                                name: locations.length + 1
                            }]
                        })

                        console.log([latitude, longitude])
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection, locations]);


    
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
    },[locations, mapConfig]);

    return (
    <>
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