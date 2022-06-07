p5.disableFriendlyErrors = true;
preload=_=> { fnt = loadImage("rsc/font-ascii_32x32.png"); }
let cvSiz;
let StarField = [];
//
setup=_=> {
  pixelDensity(1);
  frameRate(60);
  angleMode(DEGREES);
  cvSiz = createVector(1024,800);
  ix = 1040; sino = fade = p = 0; randY = 360; f = false;
  createCanvas(cvSiz.x, cvSiz.y).id("mainCanvas");
  /* StarField */
  Star.orig = createVector( width/2, height/2 );
  Star.dmax = dist(Star.orig.x, Star.orig.y, width, height);
  Star.D2R = Math.PI / 180;
  for ( let i = 0; i < 256; i++ ) StarField.push( new Star() );
  //
  rasters = [];
  Pal = [ [6,0,6], [0,6,0], [6,0,0], [6,6,0], [0,0,6], [0,6,6], [6,6,6], [3,6,2], [6,2,3], [2,3,6] ];
  buffers = [ createGraphics(1024,800), createGraphics(1024,800) ];
  buffers[0].background(0);
  snts = [
    "Hello People !",
    "Here's It's Still Captn'Furax @ Keyboard",
    "Today, Playing [again!] With Scrolltexts And P5.JS !",
    "For...",
    "...'Old School Toujours Tiny Screen II' :-) *** Yeah Baby ! ***",
    "So : P5.JS x OldSkool + Rotative Starfield",
    "Always the Good Old Fashionned ASCII-Ordered Scrolltext...",
    "...However it was improved",
    "We Forgot the 'Remastered Rasters named Neon Rasters'",
    "It's better like that.",
    "Because, You know What ????",
    "It's 2022 & ATARI Still Rulezzzzzz Your Fucking Screen Baby !",
    "*** Ok, Let's Wrap ! *** ..oO Capt'nFurax - 2022 Oo.. ***"
  ];
  blocks = Array.from( Array(snts.length), _=> Array() );
  /* La bande a Rasters et leurs Claques...euh...leurs calques. */
  for ( j=0; j < 10; j++ ) {
    rasters[j] = createGraphics(1024,80);
    rasters[j].background(0,0,0,255);
    rasters[j].strokeWeight( 1 );
    for ( i=0; i < 40; i++ ) {
      rasters[j].stroke([Pal[j][0]*(2+i), Pal[j][1]*(2+i), Pal[j][2]*(2+i)], 255);
      rasters[j].line( 0, i, 1024, i);
      rasters[j].line( 0, 79-i, 1024, 79-i);
    }
    buffers[0].image( rasters[j].get(0,0,1024,80), 0, j*80, 1024, 80 );
  }
  //
  for ( i = 0; i < snts.length; i++ ) { 
    for ( j = 0; j < snts[i].length; j++ ) {
      blocks[i].push( createGraphics(32,32) );
      blocks[i][j].image( fnt.get((snts[i].charCodeAt(j)-32)*32, 0, 32, 32 ),0, 0, 32, 32 );
    }
  }
  windowResized();
}
//
function draw() {
  background(0);
  // Starfield
  for ( let i = 0; i < StarField.length; i++ )
  {
    if ( StarField[i].frontiers() ) StarField[i].init();
    StarField[i].update();
    StarField[i].render( randY );
  }
  // Scroll Text
  for ( var i = 0; i < blocks[p].length; i++ ) { 
    image( blocks[p][i], ix + ( i<<5 ), randY + 24 + sin( frameCount + (i*24) ) * 24, 32, 32 );
  }
  // 'Ethereal' Tube
  blendMode( HARD_LIGHT );
  push();
    if( fade != 255 ) tint(255,fade);
    image(buffers[0].get(0, 440, 1024, 80), 0, randY, 1024, 80 );
  pop();
  if ( ix < blocks[p].length * -32 )
  {
    f = !f;
    (ix = 1040)&(p=(++p)%blocks.length);
  }
  //
  if ( f && fade < 5 )
    SwapMeIamFamous();
  else if ( !f && fade > 250 )
    ix -= 6;
  //
  fade = f? Math.max( 0, fade-=2.5 ) : Math.min( 255, fade+=2.5 );
}
SwapMeIamFamous=_=>
{
  buffers[1].image(buffers[0].get( 0 , 720, 1024, 80), 0, 0, 1024, 80 );
  buffers[1].image(buffers[0].get( 0, 0, 1024, 720), 0, 80, 1024, 720 );
  [ buffers[0], buffers[1] ] = [ buffers[1], buffers[0] ];
  randY = floor(random(1,9)) * 80;
  f = !f;
  print( randY );
}

windowResized=_=>{
  let ratio  = createVector( windowWidth / cvSiz.x, windowHeight / cvSiz.y );
  if ( windowWidth > windowHeight && ratio.x > ratio.y )
  {
    select("#mainCanvas").style("width", round(cvSiz.x * ratio.y) + "px");
    select("#mainCanvas").style("height", windowHeight + "px");
  } else
  {
    select("#mainCanvas").style("width", windowWidth  + "px");
    select("#mainCanvas").style("height", round(cvSiz.y * ratio.x) + "px");
  }
}

class Star
{
  static orig;
  static dmax;
  static D2R;
  constructor() { this.init(); }
  //
  init()
  {
    this.StartAng = Math.random() * 360 * Star.D2R;
    this.r = Math.random() * width/2;
    this.pos = createVector( Star.orig.x + Math.cos( this.StartAng ) * this.r, Star.orig.y + Math.sin( this.StartAng ) * this.r );
    this.col = new Array(4);
  }
  //
  update()
  {
    this.dd = Math.round(map( dist(this.pos.x, this.pos.y, Star.orig.x, Star.orig.y ), 0, Star.dmax, 0, 0xFF ));
    this.r += 0x1 | (this.dd>>3);
    //
    let ang = this.StartAng + frameCount * Star.D2R;
    this.pos.x = Star.orig.x + Math.cos( ang ) * this.r;
    this.pos.y = Star.orig.y + Math.sin( ang ) * this.r;
    this.siz = 2 | (this.dd>>6);
  }
  //
  render( randY )
  {
    let alp = 0x10 | this.dd;
    this.col = [ 255, 250, 250, alp ];
    stroke( this.col );
    strokeWeight( this.siz );
    if ( this.pos.y< randY || this.pos.y > randY+80 ) point( this.pos );
  }
  //
  frontiers() { return (this.dd > 0xFF ); }
}
