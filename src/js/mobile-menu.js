(function() {
  const navMenu = document.querySelector('.main-nav');

  const onOpen = () => {
    navMenu.classList.remove('js-none');
    navMenu.classList.add('js-block');
  };

  const onClose = () => {
    navMenu.classList.add('js-none');
    navMenu.classList.remove('js-block');
  };

  document.addEventListener('click', (evt) => {
    let target = evt.target;
    if (target.matches('.sandwitch')) {
      target.classList.toggle('active');
      navMenu.classList.contains('js-none') ? onOpen() : onClose();
    }
  });
})();
