var titles = [
  "@",
  "@W",
  "@Wa",
  "@Wan",
  "@Wang",
  "@WangYi",
  "@WangYi",
  "@WangYi",
  "@WangYi",
  "@WangYi",
];

function changeTitle() {
  var index = 0;

  setInterval(function() {
      document.title = titles[index];
      index = (index + 1) % titles.length;
  }, 1000);
}

changeTitle();
