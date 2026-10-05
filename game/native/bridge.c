/* SLIPSTREAM platform boundary: rendering, sound and input only.
   Gameplay, collision, navigation and the match all live in Common Lisp. */
#include "raylib.h"
#include "raymath.h"
#include "rlgl.h"
#include <math.h>
#include <stdlib.h>
#include <stdint.h>

#define API __declspec(dllexport)
static Camera3D cam;
static Shader world;
static Model cube;
static Sound sounds[10];
static int audio;
static Font font;
static float elapsed;
static int viewloc;
static unsigned char pressed_keys[512];

static Color color(unsigned int c) { return (Color){c>>24, (c>>16)&255, (c>>8)&255, c&255}; }
static Vector3 vec(float x,float y,float z) { return (Vector3){x,y,z}; }

API void ss_init(int w,int h) {
    SetTraceLogLevel(LOG_WARNING);
    SetConfigFlags(FLAG_MSAA_4X_HINT | FLAG_WINDOW_RESIZABLE);
    InitWindow(w,h,"SLIPSTREAM | Common Lisp Arena");
    Image icon=GenImageColor(64,64,(Color){9,18,31,255});
    for(int i=0;i<5;i++) {
        ImageDrawLine(&icon,15+i,45,33+i,14,(Color){74,229,218,255});
        ImageDrawLine(&icon,29+i,50,47+i,19,(Color){74,229,218,255});
    }
    SetWindowIcon(icon);UnloadImage(icon);
    SetWindowMinSize(960,600);
    SetExitKey(KEY_NULL);
    SetTargetFPS(144);
    cam=(Camera3D){vec(0,2,0),vec(0,2,-1),vec(0,1,0),85,CAMERA_PERSPECTIVE};
    const char *vs="#version 330\n"
        "in vec3 vertexPosition; in vec2 vertexTexCoord; in vec3 vertexNormal; in vec4 vertexColor;"
        "uniform mat4 mvp; uniform mat4 matModel; uniform mat4 matNormal;"
        "out vec3 pos; out vec3 normal; out vec4 col;"
        "void main(){pos=vec3(matModel*vec4(vertexPosition,1));normal=normalize(vec3(matNormal*vec4(vertexNormal,0)));col=vertexColor;gl_Position=mvp*vec4(vertexPosition,1);}";
    const char *fs="#version 330\n"
        "in vec3 pos; in vec3 normal; in vec4 col; uniform vec4 colDiffuse; uniform vec3 eye; out vec4 finalColor;"
        "void main(){vec4 c=colDiffuse*col;float light=0.38+0.62*max(dot(normalize(normal),normalize(vec3(-0.4,0.85,0.3))),0);"
        "vec3 tint=mix(vec3(0.66,0.76,0.9),vec3(1.0,0.94,0.84),light);"
        "float lines=step(0.965,fract(pos.x*0.5))+step(0.965,fract(pos.z*0.5));"
        "float panel=1.0-0.07*clamp(lines,0,1);vec3 rgb=c.rgb*light*tint*panel;"
        "float fog=1.0-exp(-length(eye-pos)*0.014);finalColor=vec4(mix(rgb,vec3(0.035,0.055,0.09),fog),c.a);}";
    world=LoadShaderFromMemory(vs,fs);
    viewloc=GetShaderLocation(world,"eye");
    cube=LoadModelFromMesh(GenMeshCube(1,1,1));
    cube.materials[0].shader=world;
    font=GetFontDefault();
    if(FileExists("C:/Windows/Fonts/consola.ttf")) font=LoadFontEx("C:/Windows/Fonts/consola.ttf",96,NULL,0);
    SetTextureFilter(font.texture,TEXTURE_FILTER_BILINEAR);
    InitAudioDevice(); audio=IsAudioDeviceReady();
    if(audio) {
        for(int s=0;s<10;s++) {
            int n=(s==3?22050: s==8?15435:6615);
            short *data=calloc(n,sizeof(short));
            for(int i=0;i<n;i++) {
                float t=(float)i/44100, e=powf(1-(float)i/n,s==3?2.0f:3.0f);
                float noise=(float)(rand()%20001-10000)/10000.0f;
                float wave=0;
                switch(s) {
                case 0: wave=0.45f*sinf(6.283f*(750-1800*t)*t)+0.28f*noise; break;
                case 1: wave=0.75f*noise+0.25f*sinf(6.283f*70*t);break;
                case 2: wave=0.6f*sinf(6.283f*(1900-4000*t)*t)+0.2f*noise;break;
                case 3: wave=0.8f*noise+0.2f*sinf(6.283f*45*t);break;
                case 4: wave=0.6f*sinf(6.283f*(400+1500*t)*t);break;
                case 5: wave=0.5f*sinf(6.283f*(200+6000*t)*t)+0.1f*noise;break;
                case 6: wave=0.7f*sinf(6.283f*1100*t);break;
                case 7: wave=0.6f*noise+0.3f*sinf(6.283f*100*t);break;
                case 8: wave=0.4f*sinf(6.283f*(660+220*(i/(n/3)))*t);break;
                case 9: wave=0.5f*sinf(6.283f*80*t)+0.2f*noise;break;
                }
                data[i]=(short)(wave*e*22000);
            }
            Wave wv={(unsigned int)n,44100,16,1,data};
            sounds[s]=LoadSoundFromWave(wv);free(data);
        }
    }
}
API void ss_close(void) {
    if(audio) {for(int i=0;i<10;i++) UnloadSound(sounds[i]);CloseAudioDevice();}
    if(font.texture.id!=GetFontDefault().texture.id) UnloadFont(font);
    /* The model shares the world shader; UnloadModel does not own shaders. */
    UnloadModel(cube);UnloadShader(world);CloseWindow();
}
API int ss_quit(void){return WindowShouldClose();}
API int ss_focus(void){return IsWindowFocused();}
API int ss_width(void){return GetScreenWidth();}
API int ss_height(void){return GetScreenHeight();}
API float ss_dt(void){return GetFrameTime();}
API int ss_fps(void){return GetFPS();}
API void ss_input(void){
    for(int i=0;i<512;i++) pressed_keys[i]=0;
    int key;while((key=GetKeyPressed())!=0) {if(key>0 && key<512) pressed_keys[key]=1;}
}
API int ss_key(int key){return IsKeyDown(key);}
API int ss_press(int key){return IsKeyPressed(key) || (key>0 && key<512 && pressed_keys[key]);}
API int ss_mouse(int key){return IsMouseButtonDown(key);}
API int ss_click(int key){return IsMouseButtonPressed(key);}
API float ss_mx(void){return GetMouseDelta().x;}
API float ss_my(void){return GetMouseDelta().y;}
API float ss_scroll(void){return GetMouseWheelMove();}
API int ss_cursor_x(void){return GetMouseX();}
API int ss_cursor_y(void){return GetMouseY();}
API void ss_capture(int yes){if(yes) DisableCursor();else EnableCursor();}
API void ss_fullscreen(void){ToggleBorderlessWindowed();}
API void ss_begin(void){BeginDrawing();ClearBackground((Color){9,14,23,255});elapsed+=GetFrameTime();}
API void ss_end(void){EndDrawing();}
API void ss_camera(float x,float y,float z,float dx,float dy,float dz,float fov,float roll){
    cam.position=vec(x,y,z);cam.target=vec(x+dx,y+dy,z+dz);cam.fovy=fov;
    cam.up=vec(sinf(roll),cosf(roll),0);
    SetShaderValue(world,viewloc,&cam.position.x,SHADER_UNIFORM_VEC3);BeginMode3D(cam);
}
API void ss_2d(void){EndMode3D();}
API void ss_box(float x,float y,float z,float w,float h,float d,unsigned int c){
    DrawModelEx(cube,vec(x,y,z),vec(0,1,0),0,vec(w,h,d),color(c));
}
API void ss_glow(float x,float y,float z,float w,float h,float d,unsigned int c){DrawCube(vec(x,y,z),w,h,d,color(c));}
API void ss_wire(float x,float y,float z,float w,float h,float d,unsigned int c){DrawCubeWires(vec(x,y,z),w,h,d,color(c));}
API void ss_sphere(float x,float y,float z,float r,unsigned int c){DrawSphereEx(vec(x,y,z),r,8,12,color(c));}
API void ss_ring(float x,float y,float z,float r,unsigned int c){DrawCylinderWires(vec(x,y,z),r,r,0.035f,32,color(c));}
API void ss_beam(float x,float y,float z,float bx,float by,float bz,float r,unsigned int c){DrawCylinderEx(vec(x,y,z),vec(bx,by,bz),r,r,6,color(c));}
API void ss_bot(float x,float y,float z,float yaw,unsigned int c,float walk,int weapon){
    Color body=color(c);Color dark=(Color){24,30,43,255};
    rlPushMatrix();rlTranslatef(x,y,z);rlRotatef(yaw*RAD2DEG,0,1,0);
    float swing=sinf(walk)*0.14f;
    DrawCube(vec(-0.2f,0.39f,swing),0.25f,0.7f,0.3f,dark);
    DrawCube(vec(0.2f,0.39f,-swing),0.25f,0.7f,0.3f,dark);
    DrawCube(vec(0,1.08f,0),0.68f,0.65f,0.4f,body);
    DrawCube(vec(0,1.15f,-0.225f),0.42f,0.25f,0.07f,dark);
    DrawCube(vec(0,1.55f,0),0.4f,0.34f,0.38f,dark);
    DrawCube(vec(0,1.58f,-0.2f),0.33f,0.08f,0.04f,(Color){125,250,255,255});
    DrawCube(vec(-0.45f,1.06f,-0.04f),0.22f,0.5f,0.25f,body);
    DrawCube(vec(0.45f,1.06f,-0.04f),0.22f,0.5f,0.25f,body);
    DrawCube(vec(0.39f,0.96f,-0.48f),0.24f,0.2f,0.85f,dark);
    DrawCube(vec(0.39f,0.96f,-0.9f),0.18f,0.14f,0.03f,body);
    rlPopMatrix();
}
API void ss_weapon(int kind,float bob,float recoil){
    Vector3 forward=Vector3Normalize(Vector3Subtract(cam.target,cam.position));
    Vector3 right=Vector3Normalize(Vector3CrossProduct(forward,cam.up));
    Vector3 up=Vector3CrossProduct(right,forward);
    Vector3 p=Vector3Add(cam.position,Vector3Add(Vector3Scale(forward,0.8f-recoil*0.16f),Vector3Add(Vector3Scale(right,0.33f),Vector3Scale(up,-0.29f+bob))));
    float yaw=atan2f(-forward.x,-forward.z)*RAD2DEG;
    float pitch=asinf(forward.y)*RAD2DEG;
    rlPushMatrix();rlTranslatef(p.x,p.y,p.z);rlRotatef(yaw,0,1,0);rlRotatef(pitch,1,0,0);
    Color metal={34,42,55,255};Color edge={90,107,125,255};
    Color accent=kind==0?(Color){74,229,218,255}:kind==1?(Color){255,190,91,255}:kind==2?(Color){255,106,67,255}:(Color){183,139,255,255};
    DrawCube(vec(0,-0.08f,0.08f),0.13f,0.2f,0.19f,(Color){77,63,64,255});
    DrawCube(vec(0,0,-0.16f),kind==2?0.28f:0.18f,kind==2?0.22f:0.16f,0.54f,metal);
    DrawCube(vec(0,0.07f,-0.17f),0.13f,0.055f,0.4f,edge);
    DrawCube(vec(0,0.101f,-0.16f),0.06f,0.013f,0.29f,accent);
    if(kind==1) {DrawCube(vec(-0.056f,0,-0.52f),0.07f,0.07f,0.28f,edge);DrawCube(vec(0.056f,0,-0.52f),0.07f,0.07f,0.28f,edge);}
    else if(kind==2) {DrawCylinderEx(vec(0,0,-0.42f),vec(0,0,-0.67f),0.11f,0.11f,12,edge);DrawCylinderEx(vec(0,0,-0.675f),vec(0,0,-0.68f),0.075f,0.075f,12,metal);}
    else {DrawCube(vec(0,0,-0.54f),0.1f,0.1f,kind==3?0.5f:0.26f,edge);DrawCube(vec(0,0.052f,-0.53f),0.04f,0.014f,0.24f,accent);}
    if(recoil>0.62f) DrawSphere(vec(0,0,-0.72f),0.09f+recoil*0.06f,accent);
    rlPopMatrix();
}
API void ss_rect(int x,int y,int w,int h,unsigned int c){DrawRectangle(x,y,w,h,color(c));}
API void ss_gradient(int x,int y,int w,int h,unsigned int a,unsigned int b){DrawRectangleGradientV(x,y,w,h,color(a),color(b));}
API void ss_line(int x,int y,int bx,int by,unsigned int c){DrawLine(x,y,bx,by,color(c));}
API void ss_circle(int x,int y,float r,unsigned int c){DrawCircle(x,y,r,color(c));}
API void ss_text(const char *s,int x,int y,int size,unsigned int c){DrawTextEx(font,s,(Vector2){x,y},size,1,color(c));}
API int ss_measure(const char *s,int size){return (int)MeasureTextEx(font,s,size,1).x;}
API void ss_sound(int kind,float volume,float pan){if(audio && kind>=0 && kind<10){SetSoundVolume(sounds[kind],volume);SetSoundPan(sounds[kind],pan);PlaySound(sounds[kind]);}}
API int ss_audio(void){return audio;}
API void ss_shot(const char *path){Image screenshot=LoadImageFromScreen();ExportImage(screenshot,path);UnloadImage(screenshot);}
