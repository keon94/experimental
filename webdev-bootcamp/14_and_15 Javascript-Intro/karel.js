function main(){
    moveRight(true);
    move();
    moveLeft();
    move();
    moveRight();
    move();
    moveLeft();
    move();
    moveRight();
    console.log("Done!");
 }
 
 function moveRight(i0 = false) {
    if (!i0) {
       turnRight();
    }
    putBeeper();
    move();
    move();
    putBeeper();
    move();
    move();
    putBeeper();
    turnLeft();
 }
 
 function moveLeft() {
    turnLeft();
    move();
    putBeeper();
    move();
    move();
    putBeeper();
    move();
    turnRight();
 }

 function move() {}
 function turnLeft() {}
 function turnRight() {}
 function putBeeper() {}

 main();