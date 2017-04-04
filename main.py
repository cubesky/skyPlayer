# -*- coding: UTF-8 -*-
# ++++++++++[>++++++++++[>+>+>+>+>+>+>+>>+>+>>+>+>+>+>+>>+>+>+>+>+>+>+>>>+>+>+>+>+>>>>+>+>+>+>+>>+>+>+>+><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-]>-->+>++>>+>>>+++>-+>++>+++>---+>>++>>+>+++++>-->+>++>----+>>>>+>+>>++>++>+>+>++++++>+++++>+++++>+>>++>>+>+++++>>-+>++>>+<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-]>>.>+.>-.>+.>++++.>+.>.>++.>--.>+.>++.>----.>+++++.>+.>+++++.>.>---.>+++.>---.>+.>-.>.>+++.>+.>+++.>.>++++.>----.>----.>++.>+++++.>--.>---.>---.>--.>+++++.>+.>+++++.>.>----.>.>---.>----.>+.>.
from flask import Flask, request, render_template
import string, os, sys
import random
import platform
reload(sys)
sys.setdefaultencoding("utf-8")
app=Flask(__name__)
datadir='static/data/'

def changeCode():
    sysstr = platform.system()
    if(sysstr =="Windows"):
        return True
    elif(sysstr == "Linux"):
        return False
    else:
        return False

@app.route('/fonts/<font>')
def fonts(font):
    return redirect('/static/fonts/' + font), 301

@app.route('/lrceditor/<music>')
def editor(music):
    return render_template('editor.html',musicfile='/static/data/'+music+'.music/music.mp3');

@app.route('/inline')
def inline():
    return render_template('inline.html')

@app.route('/random')
def randomMusic():
    dataDirs=os.listdir(datadir)
    listedDir=[]
    for i in dataDirs:
        if '.music' in i:
            listedDir.append(i)
    selfile=datadir+ random.choice(listedDir) +'/data.txt'
    with open(selfile, 'r') as myfile:
        if(changeCode()):
            data=myfile.read().decode("gbk").replace('\n', '')
        else:
            data=myfile.read().replace('\n', '')
    return data

@app.route('/')
def index():
    return render_template('index.html')

if __name__=='__main__':
    app.run(host='127.0.0.1',port=9099)