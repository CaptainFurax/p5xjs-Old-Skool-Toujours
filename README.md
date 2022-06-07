# p5xjs-Old-Skool-Toujours [ p5xjs-Old-Fashionned-ScrollText v2 + Stafield ]

![OldFashionned-ScrollText](https://github.com/CaptainFurax/p5xjs-Old-Fashionned-ScrollText/blob/main/CPT2206070740-1179x921.png)

+ Today, playing with an Old Fx : An ASCII-Ordered Scrolltext built over a Bitmap :)
  + [.oO° Online Demo °Oo.](https://captainfurax.github.io/p5xjs-Old-Fashionned-ScrollText/)
  + Specs : 
    + 2D Canvas, very smooth and fast at only 50fps with a 64x64px character font. 
    + Organize your bitmap font by ASCII Code...order !
    + Copy your characters indexed by their code, sub 32 [ first chr == space ] and mult by the width [ here , 64px ] - You've got it's x index !
    + Ex : 
      +  "!" -> Code ASCII -> 33 
      +  (33 - 32) * 64 -> 64, x index/pos° of "!" into the bitmap.
![ASCII-Ordered-Font](https://github.com/CaptainFurax/p5xjs-Old-Fashionned-ScrollText/blob/main/FONT-32x32-st.png)
```javascript
  for ( i = 0; i < snts.length; i++ ) { 
    //snts[i] = snts[i].toUpperCase();
    for ( j = 0; j < snts[i].length; j++ ) {
      blocks[i].push( createGraphics(64,64) );
      blocks[i][j].image( fnt.get((snts[i].charCodeAt(j)-32)*64, 0, 64, 64),0, 0, 64, 64 );
    }
  }
```
+ After, i just play with pixels blending :
  + To color the characters( a bigger raster with 'HARD_LIGHT' blending over them )
  + Sliding the Masked-Rasters bitmap used in background with a shifted offset, allow you to very simply change the characters colors at each sentences
+ Tricks #1 : Using combination of image() + get() functions is x2.5 faster with buffered(logical screen) - which is not true with physical screen :
```javascript
// is better 
blocks[i][j].image( fnt.get((snts[i].charCodeAt(j)-32)*64, 0, 64, 64), 0, 0, 64, 64 );
// than "copy" function :
blocks[i][j].copy( fnt, (snts[i].charCodeAt(j)-32)*64, 0, 64, 64, 0, 0, 64, 64 );
```
+ Tricks #2 : Shifting/scrolling the buffered rasters with 2 logical screens :
```javascript
SwapMeIamFamous=_=>
{
  (p=(++p)%blocks.length);
  buffers[1].image( buffers[0].get(0, 400, 640, 80), 0, 0, 640, 80 );
  buffers[1].image( buffers[0].get(0,0,640,400), 0, 80, 640, 400 );
  buffers[0,1] = buffers[1,0];
}
```
