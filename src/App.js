import logo from './logo.svg';
import './App.css';
import {useState, useRef, useMemo, useCallback} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import ProgressBar from 'react-bootstrap/ProgressBar';

import Ciudades from "./capitalCities.json";

function App() {

  const [ puntuacion, cambioPuntuacion ] = useState(1500)
  const [ acertados, cambioAcertados ] = useState(0)
  const [ error, cambioError ] = useState(0)
  const [ position, setPosition ] = useState([50.99298388467372, 10.78845445118975])
  const marcadorRef = useRef(null)

  const reset= () => {
    cambioPuntuacion(1500)
    cambioAcertados(0)
    setPosition([50.99298388467372, 10.78845445118975])
    cambioError(0)
  }

  const eventoMapa = useMemo(
    () => ({
      dragend() {
        const marcador = marcadorRef.current
        if (marcador != null) {
          setPosition(marcador.getLatLng())
          cambioError(0)
        }
      },
    }),
    [],
  )

  const comprobar= () => { 
    var ciudadlatlong = {
      'lat': Ciudades.capitalCities[acertados].lat,
      'lng':Ciudades.capitalCities[acertados].long
    };

    var dismetros = position.distanceTo(ciudadlatlong);
    var diskm = Math.round(dismetros/ 1000);

    if(acertados < Ciudades.capitalCities.length && puntuacion > 0){
      if(diskm  <= 50 ){
        cambioAcertados(acertados+1); 
      }
      else{
        if(puntuacion - diskm < 0 ){
          cambioPuntuacion(0)
        }else{
          cambioPuntuacion(puntuacion - diskm)
          cambioError(diskm)
        }
        
      }
    }
  }

  return (
    <div>
      <header>

        <div className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container">
            <a href="#" className="navbar-brand">
              <strong>Cities Quiz</strong>
            </a>
          </div>
        </div>

      </header>

      <main>

        <section className="py-5 text-center container">
          <div className="row align-items-start">
            <div className="col-lg-6 col-xl-3">
              

              <h5>Selecciona en el mapa la localización de: <b>{Ciudades.capitalCities[acertados].capitalCity}</b></h5>
              <p className="fs-6 fw-light">Mueve el punto del mapa y pulsa el botón para comprobar</p>
              <button type="button" onClick={() => comprobar()}  className="btn btn-primary">Comprobar ubicación</button>


              {puntuacion != 0 && acertados === Ciudades.capitalCities.length ?
                (<div className="alert alert-success" role="alert">
                  <p>¡Enhorabuena 😃!</p>
                  <p>Has conseguido averiguar todas las posiciones de las ciudades!</p>
                  <p>Tu puntación es de <b>{puntuacion}</b></p>
                </div>) : ""
              }

              {puntuacion == 0 ?
                (<div className="alert alert-danger" role="alert">
                  <p>¡Has perdido! 🙁</p>
                  <p>Puedes volver a intentarlo</p>
                </div>) : ""
              }

              <div className="card p-4 mt-3">

                <h6>Puntuación actual: <span className="badge rounded-pill text-bg-secondary">{puntuacion}</span></h6>
                { error > 0 ?
                  (<p className="mb-3 fs-7">Localización incorrecta, - {error} puntos</p>
                  ) : ""
                }

                { acertados > 0 ?
                  (<span className="badge mb-3 text-bg-success"><span>{acertados}</span> ciudades acertadas</span>
                  ) : ""
                }

                <ProgressBar now={acertados} label={`${acertados * 10}%`} max={Ciudades.capitalCities.length} />
                
              </div>

              <button type="button" onClick={() => reset()} className="mt-2 mb-2 btn btn-secondary btn-sm">Volver a empezar</button>

              <div className="d-none d-lg-block mt-2 list">
                <hr />
                <h5>Listado de ciudades</h5>
                
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Ciudad</th>
                    </tr>
                  </thead>
                  <tbody>
                  
                    {Ciudades.capitalCities.map((ciudad,index) => (
                      <tr key={index}>
                        <th scope="row">{index+1}</th>
                        <td>{ciudad.capitalCity}</td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div >
            <div className="col"> 

              <MapContainer center={[50.99298388467372, 10.78845445118975]} zoom={4}>
                <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />

                <Marker
                  draggable={true}
                  eventHandlers={eventoMapa}
                  position={position}
                  ref={marcadorRef}>
                </Marker>

              </MapContainer>

            </div>
          </div>
          
        </section>

      </main>
    </div>
  );
}

export default App;
