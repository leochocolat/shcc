// let divNumber = Math.ceil( window.innerHeight / $(".hi-line").height() );
// let divHeight = $(".hi-line").height();
// let divWidth = $(".hi-line").width();
// let spanWidth = $(".hi").width();
// let hiLine = $(".hi-line span")[0].innerHTML;
// let div;
//
// console.log(divWidth);
//
// for(i = 0; i <= divNumber; i++) {
//   let div = document.createElement("DIV");
//   div.setAttribute("class", "hi-line");
//   // div.innerHTML = hiLine;
//   document.getElementById("container-hi").appendChild(div);
//
//   for(a = 0; a <= 1; a++) {
//     let span = document.createElement("SPAN");
//     span.setAttribute("class", "hi");
//     span.innerHTML = hiLine;
//     div.appendChild(span);
//   }
//
// }
//
// let PixelPerFrame = 5;
// let windowWidth = window.innerWidth;
// let timingAnim;
// let timingAnim2 = $(".hi").width() / (60 * PixelPerFrame);
//
// $("body").mousedown(function(){
//   function acceleration(){
//     PixelPerFrame ++;
//     if(PixelPerFrame <= 100) {
//       window.requestAnimationFrame(acceleration);
//     }
//   }
//   window.requestAnimationFrame(acceleration);
// });
//
// $("body").mouseup(function(){
//   PixelPerFrame = 5;
// });
//
//
// function step() {
//   timingAnim = (windowWidth/2) / (60 * PixelPerFrame);
//   $(".hi-line").css("left", "-=" + PixelPerFrame);
//   leftOffset = $(".hi-line").offset().left;
//   let divWidthUpToDate = $(".hi-line").width();
//   // console.log(timingAnim);
//   window.requestAnimationFrame(step);
// }
//
// function restartAnim(){
//   setTimeout(function(){
//     $(".hi-line").css("left", "0");
//     window.requestAnimationFrame(restartAnim);
//   }, timingAnim2 * 1000);
// }
//
//
// function createRemove() {
//   timingAnim = (windowWidth/2) / (60 * PixelPerFrame);
//   setTimeout(function(){
//     console.log("new");
//     for(i = 0; i < $(".hi-line").length; i++) {
//       let span = document.createElement("SPAN");
//       span.setAttribute("class", "hi");
//       span.innerHTML = hiLine;
//       document.getElementsByClassName("hi-line")[i].appendChild(span);
//     }
//     // $(".hi")[0].remove();
//     // $(".hi-line").css("left", -20);
//     window.requestAnimationFrame(createRemove);
//   }, timingAnim * 1000);
// }
//
//
// $(document).ready(function(){
//   window.requestAnimationFrame(createRemove);
//   window.requestAnimationFrame(step);
//   // window.requestAnimationFrame(restartAnim);
// });
