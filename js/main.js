const slider = document.querySelector('.slider-container'), 
    slides = Array.from(document.querySelectorAll('.slide'))

let isDragging = false, 
    startPosition = 0, 
    currentTranslate = 0, 
    prevTranslate = 0, 
    animationID, 
    currentIndex = 0

slides.forEach((slide, index) => {  
    /*
    // Evitar arrastrar la transparencia de la imagen
    const slideImage = slide.querySelector('img'); 
    slideImage.addEventListener("dragstart",  (e) =>  e.preventDefault());
    */
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
window.oncontextmenu = function(event) {
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

    if(movedBy < -80 && currentIndex < slides.length -1)
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