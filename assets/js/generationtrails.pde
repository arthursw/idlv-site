int dimx = 1000;
int dimy = 1000;

int nCurvesMax = 100;
int nCurves = 0;

int trailSize = 3;
float trailLengthMax = 17;
float trailNoise = 0;

float pAngle = 0.0;

int[] grid;
Curve[] curves;

float pGeneration = 10;
int lifetimeMax = 1000;
int imax = dimx * dimy - 1;

void setup() {
  size(1000, 1000, P3D);
  initialize();

}

void draw() {
  for (int n=0 ; n < nCurves  ; n++) {
    curves[n].iterate();
  }
}

void mousePressed() {
  
}

void initialize() {
  
  background(255);
  nCurves = 0;
  curves = new Curve[nCurvesMax];
  grid = new int[dimx * dimy];

  for (int y = 0 ; y < dimy ; y++) {
    for (int x = 0 ; x < dimx ; x++) {
      grid[int(x + y * dimx)] = 0;
    }
  }

  makeCurve(-1, -1);
}

void makeCurve(float x, float y) {
  if(nCurves<nCurvesMax) {
    curves[nCurves] = new Curve(x, y);
    nCurves++;
  }
}

class Curve {
  float x, y;
  float angle;
  float lifetime;
  float time;
  int indexPrev;
  float trailLength;

  Curve(float xi, float yi) {
    initialize(xi, yi);
  }

  void initialize(float xi, float yi) {
    if(xi < 0 && yi < 0 && nCurves > 0) {
      int n = int(random(nCurves-1));
      xi = curves[n].x;
      yi = curves[n].y;
    }
    
    x = xi < 0 ? dimx/2 : xi; // random(dimx-1) : xi;
    y = yi < 0 ? dimy/2 : yi; // random(dimy-1) : yi;
    int dir = int(random(5.0));
    angle = dir * 90.0;
    //angle = random(360);
    lifetime = random(lifetimeMax);
    time = 0;
    indexPrev = int(x + y * dimx);
    trailLength = random(trailLengthMax);
  }

  void iterate() {
    float radius = 1;
    x += radius * cos(angle * PI / 180);
    y += radius * sin(angle * PI / 180);
    int ix = int(x);
    int iy = int(y);
    int index = int(ix + iy * dimx);
    if(index == indexPrev) {
      return;
    }
    indexPrev = index;
    if(x < 0 || y < 0 || x >= dimx-1 || y >= dimy-1 || grid[index] > 0 || time > lifetime) {
      initialize(-1, -1);
      return;
    }
    strokeWeight(0.5);
    stroke(128);
    point(ix, iy);
    grid[index] = 1;
    
    //drawTrail(x, y, angle, trailLength);
    
    angle += random(pAngle)- (pAngle / 2);
    time++;

    if(random(100.0) < pGeneration) {
      makeCurve(x, y);
    }
  }
  
  void drawTrail(float x, float y, float angle, float trailLength) {
    trailLength = trailLength + random(-trailLengthMax/10, trailLengthMax/10);
    float trailStep = trailLength / trailSize;
    angle += 90; // random(1) < 0.5 ? 90 : -90;
    for(int n=0 ; n<trailSize ; n++) {
      x += trailStep * cos(angle * PI / 180);
      y += trailStep * sin(angle * PI / 180);
      x += random(-trailNoise, trailNoise);
      y += random(-trailNoise, trailNoise);
      
      stroke(random(255, 25 - 25 * n / float(trailSize)));
      point(int(x), int(y));
    }
  }
}
