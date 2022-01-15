const slider = document.querySelector('.slider-container'),
    slides = Array.from(document.querySelectorAll('.slide'))
;

let isDragging = false, /*Dedo o click.*/
    startPosition = 0,   // Donde pongamos dedo/click en movil/navegador.
    currentTranslate = 0, // El valor que queremos para translate.
    prevTranslate = 0, // El valor previo de translate.(?
    animationID = 0, // Cuando hagamos nuestra animación haremos uso de "request animation frame" es un metodo en la ventana de objetos y retorna un "id" específico que podemos usar para cancelar el requestFrame.
    currentIndex = 0 // Representará el slide Actual. primero será 0 seg 1 etc.
;

slides.forEach((slide, index) => {
    // Para quitar el efecto que hace que al arrastrar aparezca una transparencia de la imagen.
    const slideImage = slide.querySelector('img')  //--- no tengo img. usar sólo en caso de tenerla
    slideImage.addEventListener("dragstart",  (e) =>  e.preventDefault())
        
        
        
    // touch events // 'touchstart'> cuando pones el dedo en la pantalla
    slide.addEventListener('touchstart', touchStart(index))
    slide.addEventListener('touchend', touchEnd)
    slide.addEventListener('touchmove', touchMove)
        
        
    // mouse events
    slide.addEventListener('mousedown', touchStart(index))
    slide.addEventListener('mouseup', touchEnd)
    slide.addEventListener('mouseleave', touchEnd)
    slide.addEventListener('mousemove', touchMove)     
})

// disable context menu
window.oncontextmenu = function (event) {
    event.preventDefault()
    event.stopPropagation()
    return false
}


function touchStart(index) {
    return function(event) {
        currentIndex = index
        startPos = getPositionX(event)
        isDragging = true
        /* for the animation usaremos request animation frame, le dice al browesre que queremos hacer una animation y también pide la llamada a realizar una determinada funcion, para actualizar antes del proximo 'repay' (o algo así) y podes hacer cualquier tipo de animacion que quieras, lo que hacemos aqui es animar translateX porque queremos que se mueva en el eje X. */
        animationID = requestAnimationFrame(animation)
        slider.classList.add('grabbing')
    }
}


function touchEnd() {
    isDragging = false
    cancelAnimationFrame(animationID)
    
    const movedBy = currentTranslate - prevTranslate

    if(movedBy < -100 && currentIndex < slides.length -1)
    currentIndex += 1
    
    if(movedBy > 100 && currentIndex > 0) currentIndex -= 1

    setPositionByIndex()
    /*cerrar manito del cursor*/
    slider.classList.remove('grabbing')
}

function touchMove(event){
    if (isDragging) {
        const currentPosition = getPositionX(event)
        currentTranslate = prevTranslate + currentPosition - startPos
    }    
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function animation() {
    setSliderPosition()
    if(isDragging) requestAnimationFrame(animation);
}


function setSliderPosition(){
    slider.style.transform = `translateX(${currentTranslate}px)` 
}


function setPositionByIndex() {
    currentTranslate = currentIndex * -window.innerWidth
    prevTranslate = currentTranslate
    setSliderPosition();
}