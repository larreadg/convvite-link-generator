import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import shareIcon from './assets/svg/share.svg'
import convviteImg from './assets/png/convvite.png'

function App() {

  const endOfMessagesRef = useRef(null);
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const url = queryParams.get('url')

  const [nombre, setNombre] = useState('')
  const [jovenes, setJovenes] = useState(0)
  const [adultos, setAdultos] = useState(0)
  const [mensaje, setMensaje] = useState('')
  const [link, setLink] = useState(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [link])
  
  useEffect(() => {
    const storedMensaje = localStorage.getItem('mensaje')
    setMensaje(storedMensaje !== null ? storedMensaje : '¡Hola! Te invito a mi fiesta 😀🎉')
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target

    if (name === 'nombre') {
      setNombre(value)
    } else if (name === 'jovenes') {
      setJovenes(value)
    } else if (name === 'adultos') {
      setAdultos(value)
    } else if (name === 'mensaje') {
      localStorage.setItem('mensaje', value)
      setMensaje(value)
    }
  }

  if(!url){
    return (
      <>
        <section className='convvite_brand_container'>
          <img src={convviteImg} alt='convviteImg'/>
        </section>
        <h1 className='convvite_title'>Query string URL requerida</h1>
      </>
    )
  }

  const handleSubmit = async () => {
    const data = btoa(unescape(encodeURIComponent(JSON.stringify({
      i: nombre,
      j: jovenes,
      a: adultos
    }))))
    setLink(`${url}/?key=${data}`)
  }
  
  const clearForm = () => {
    setNombre('')
    setAdultos(0)
    setJovenes(0)
    const storedMensaje = localStorage.getItem('mensaje')
    setMensaje(storedMensaje !== null ? storedMensaje : '¡Hola! Te invito a mi fiesta 😀🎉')
    setLink(null)
  }

  const shareLink = async (event) => {
    event.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Compartir enlace',
          url: link, 
          text: mensaje
        });
        console.log('Enlace compartido exitosamente');
      } catch (error) {
        console.error('Error al compartir el enlace', error);
      }
    } else {
      console.log('La API de compartir no es compatible con este navegador');
    }
  };

  return (
    <>
      <section className='convvite_brand_container'>
        <img src={convviteImg} alt='convviteImg'/>
      </section>
      <section className='convvite'>
        <h1 className='convvite_title'>Generar link de invitación</h1>
        <form className='convvite_form'>
          <section className='convvite_form_input_group'>
            <label>Tarjeta Digital</label>
            <p className='convvite_tarjeta_digital'>{url}</p>
          </section>
          <section className='convvite_form_input_group'>
            <label>Nombre del invitado</label>
            <input type="text" name="nombre" placeholder='Ingrese nombre del invitado...' value={nombre} onChange={handleInputChange} />
          </section>
          <section className='convvite_form_input_group'>
            <label>Cantidad de jóvenes</label>
            <input type="number" name="jovenes" placeholder='Ingrese cantidad de jóvenes...' value={jovenes} onChange={handleInputChange} />
          </section>
          <section className='convvite_form_input_group'>
            <label>Cantidad de adultos</label>
            <input type="number" name="adultos" placeholder='Ingrese cantidad de adultos...' value={adultos} onChange={handleInputChange} />
          </section>
          <section className='convvite_form_input_group'>
            <label>Mensaje al compartir enlace</label>
            <textarea type="text" name="mensaje" value={mensaje} onChange={handleInputChange} />
          </section>
          <button onClick={handleSubmit} className={`convvite_button ${nombre == '' || jovenes < 0 || adultos < 0 ? 'disabled' : ''}`} type="button" disabled={nombre == '' || jovenes < 0 || adultos < 0}>Generar Link</button>
          <button onClick={clearForm} className='convvite_button_secondary' type="button">Limpiar</button>
        </form>
        {link !== null && (
          <section className='convvite_link' ref={endOfMessagesRef}>
            <a href={link}>{link}</a>
            <button onClick={shareLink} className='convvite_button_secondary' type="button">
              <section className='container_with_icon'>
                <img src={shareIcon} alt='shareIcon' className='convvite-share-icon'/>
                <p>Compartir</p>
              </section>
            </button>
          </section>
        )}
      </section>
    </>
  )
}

export default App
