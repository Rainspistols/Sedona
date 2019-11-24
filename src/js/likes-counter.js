(function() {
  const likes = document.querySelectorAll('.likes');
  likes.forEach((item) => {
    const likesCounter = item.querySelector('.likes__count');
    const likeBtn = item.querySelector('.likes__icon');
    let counter = parseInt(likesCounter.innerText);

    const increase = (target) => {
      counter++;
      likesCounter.innerText = counter;
      target.classList.add('voted');
      target.querySelector('path').style.fill = `#81b3d2`;
    };

    const decrease = (target) => {
      counter--;
      likesCounter.innerText = counter;
      target.classList.remove('voted');
      target.querySelector('path').style.fill = `#b2b2b2`;
    };

    likeBtn.addEventListener('click', (evt) => {
      const target = evt.target;
      target.matches('.voted') ? decrease(target) : increase(target);
    });
  });
})();
