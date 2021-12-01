from os import stat
import os
from typing_extensions import final
from django.db.models.query import QuerySet
from django.http.response import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
# from game_backend.game_backend.settings import AWS_ACCESS_KEY_ID
from rest_framework import generics
from boto.s3.connection import S3Connection
from boto3.session import Session
from botocore.client import Config
from .serializer import imageDataSerializer,getScoreSerializer,gameOverSerializer,RewardSerializer,Login_getuserSerializer, SelectionSerializer, UserSerializer, stateSerializer,CreatestateSerializer,MoveSerializer,LoginSerializer
from .models import image_data, state,move,user,user_stats,trained_model
import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models.query_utils import DeferredAttribute
from io import BytesIO
import joblib
from django.core.files.storage import default_storage
# Create your views here.
from django.core.files.base import ContentFile
import random
import numpy as np
import torch
from .model import Linear_QNet,QTrainer
from .Helper import plot
from collections import UserDict, deque
from enum import Enum

status = "User"
status2 = ""
image_path="./static/images/avatar1.png"
buffer = BytesIO()
class Direction(Enum):
    RIGHT = 1
    LEFT = 2
    UP = 3
    DOWN = 4
class stateview(generics.ListAPIView):
    queryset = state.objects.all()
    queryset2 = move.objects.all()
class Agent:
    def __init__(self,num,file_path=r'api\saved_model\trained3.pth'):
        print("Agent created...")
        self.model = Linear_QNet(11, 256, 3)
        self.num = num
        self.n_games = 0
        self.MAX_MEMORY = 100_000
        self.BATCH_SIZE = 1000
        self.LR = 0.001
        self.epsilon = 0 # randomness
        self.gamma = 0.9 # discount rate
        self.memory = deque(maxlen=self.MAX_MEMORY)
        if(num==1):
            self.trainer = QTrainer(self.model, lr=self.LR, gamma=self.gamma)
        #torch.load('D:\\SnakeAI\\new_model.h5')#D:\react\game_backend\api\saved_model\trained3.pth
        if(num==2):
            print(file_path)
            self.model.load_state_dict(torch.load(file_path))
        self.plot_scores = []
        self.plot_mean_scores = []
        self.total_score = 0
        self.record = 0
        self.reward=0
        self.score=0
        self.done=False
        self.final_move=[0,0,0]
        self.state_old = [0,0,0,0,1,0,0,0,1,0,1]
        self.new_state = [0,0,0,0,0,0,0,0,0,0,0]
        self.flag = False
    
    # def buffer_save2():


    def get_state(self,head_x,head_y,food_x,food_y,direction,point_l,point_r,point_u,point_d):
        
        dir_l = direction == "LEFT"
        dir_r = direction == "RIGHT"
        dir_d = direction == "DOWN"
        dir_u = direction == "UP"

        state = [
            # Danger straight
            (dir_r and point_r) or 
            (dir_l and point_l) or 
            (dir_u and point_u) or 
            (dir_d and point_d),

            # Danger right
            (dir_u and point_r) or 
            (dir_d and point_l) or 
            (dir_l and point_u) or 
            (dir_r and point_d),

            # Danger left
            (dir_d and point_r) or 
            (dir_u and point_l) or 
            (dir_r and point_u) or 
            (dir_l and point_d),
            
            # Move direction
            dir_l,
            dir_r,
            dir_u,
            dir_d,
            
            # Food location 
            food_x < head_x,  # food left
            food_x > head_x,  # food right
            food_y < head_y,  # food up
            food_y > head_y  # food down
            ]
        return np.array(state, dtype=int)
    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done)) # popleft if MAX_MEMORY is reached

    def train_long_memory(self):
        print("Training...")
        if (len(self.memory) > agent.BATCH_SIZE):
            mini_sample = random.sample(self.memory, agent.BATCH_SIZE) # list of tuples
        else:
            mini_sample = self.memory
        states, actions, rewards, next_states, dones = zip(*mini_sample)
        self.trainer.train_step(states, actions, rewards, next_states, dones)
        # for state, action, reward, next_state, done in list(mini_sample):
        #    self.trainer.train_step(state, action, reward, next_state, done)

    def train_short_memory(self, state, action, reward, next_state, done):
        self.trainer.train_step(state, action, reward, next_state, done)

    def get_action(self, state):
        self.epsilon = 80 - self.n_games
        final_move = [0,0,0]
        if random.randint(0, 200) < self.epsilon and self.num==1:
            move = random.randint(0, 2)
            final_move[move] = 1
            # print("Random")
        else:
            state0 = torch.tensor(state, dtype=torch.float)
            prediction = self.model(state0)
            move = torch.argmax(prediction).item()
            final_move[move] = 1
            # print("AI")
        # print(final_move)
        return final_move

agent1 = Agent(1)
agent2 = Agent(2)
agent3 = Agent(2)
def train(agent,head_x,head_y,food_x,food_y,direction,point_l,point_r,point_u,point_d,done,reward_s,score_s,t):
    # # get old state
    # print("Training...")
    # print("Head_x: ",head_x," Head_y: ",head_y," Food_x: "
    # ,food_x," Food_y: ",food_y," Done: ",done,
    # " Direction: ",direction,"Col_l",point_l,"Col_r",point_r,"Col_u",point_u,"Col_d",point_d)
    # print("reward: ",agent.reward," score: ",agent.score)
    # if(t==1):
    #     agent = agent1
    # elif(t==2 and status == "User"):
    #     agent = agent2
    # else:
    #     agent = agent3
    if(agent.num==1):
        if agent.flag == True:
            agent.train_short_memory(agent.state_old, agent.final_move, agent.reward, agent.new_state, agent.done)
        #     # remember
            agent.remember(agent.state_old, agent.final_move, agent.reward, agent.new_state, agent.done)
    # perform move and get new state
        
        if agent.done:
            # train long memory, plot result
            agent.n_games += 1
            if(t==1):
                # agent.train_long_memory()
                print(agent.record,agent.score)
                if agent.score > agent.record:
                    agent.record = agent.score
                    agent.model.save()
    agent.flag = True
    agent.curr_state = agent.get_state(head_x,head_y,food_x,food_y,direction,point_l,point_r,point_u,point_d)
    agent.final_move = agent.get_action(agent.curr_state)
    # print(agent.final_move)
    #agent.state_new = agent.get_state(head_x,head_y,food_x,food_y,direction,point_l,point_r,point_u,point_d)
    agent.state_old = agent.curr_state
        # print('Game', agent.n_games, 'Score', score_s, 'Record:', record)

        # agent.plot_scores.append(score_s)
        # agent.total_score += score_s
        # mean_score = agent.total_score / agent.n_games
        # agent.plot_mean_scores.append(mean_score)
        # plot(agent.plot_scores, agent.plot_mean_scores)

class SelectionModel(APIView):
    select = SelectionSerializer
    def post(self,request,format=None):
        serializer = self.select(data=request.data)
        if(serializer.is_valid()):
            select = serializer.data.get('select')
        # print(select)
        return Response({'Bad Request': 'Invalid data...'})

class GetReward(APIView):
    # print("Reward...")
    serializer_class = RewardSerializer
    def post(self,request,format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            head_x = serializer.data.get('head_x')
            head_y = serializer.data.get('head_y')
            food_x = serializer.data.get('food_x')
            food_y = serializer.data.get('food_y')
            direction_s = serializer.data.get('direction_s')
            done_s   = serializer.data.get('done_s')
            reward_s = serializer.data.get('reward_s')
            score_s = serializer.data.get('score_s')
            col_l = serializer.data.get('col_l')
            col_r = serializer.data.get('col_r')
            col_u = serializer.data.get('col_u')
            col_d = serializer.data.get('col_d')
            mode_s = serializer.data.get('mode_s')
            state.head_x=head_x
            state.head_y=head_y
            state.food_y=food_y
            state.food_x=food_x
            state.done_s = done_s
            state.direction_s = direction_s
            state.reward_s = reward_s
            state.score_s = score_s
            state.col_l = col_l
            state.col_r = col_r
            state.col_u = col_u
            state.col_d = col_d
            state.mode_s = mode_s
            # print(mode_s)
            if(mode_s=="P" and status=="User"):
                agent=agent2
            elif(mode_s=="P" and status!="User"):
                agent=agent3
            else:
                agent=agent1
                
                print("New score: " ,score_s ," Record: ",agent.record)
                if(agent.record<score_s and mode_s=="T"):
                    print(" Best Score \n New score: " ,score_s ," Record: ",agent.record)
                    agent.record = score_s
                    agent.model.save()

            agent.new_state = agent.get_state(head_x,head_y,food_x,food_y,direction_s,col_l,col_r,col_u,col_d)
            agent.reward = reward_s
            agent.score =score_s
            agent.done = done_s
            # print(agent.new_state)
        return Response({'Bad Request': 'Invalid data...'})

class CreateStateView(APIView):
    serializer_class = CreatestateSerializer
    move_class = MoveSerializer
    
    def post(self,request,format=None):
        # if not self.request.session.exists(self.request.session.session_key):
        #     self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            head_x = serializer.data.get('head_x')
            head_y = serializer.data.get('head_y')
            food_x = serializer.data.get('food_x')
            food_y = serializer.data.get('food_y')
            direction_s = serializer.data.get('direction_s')
            done_s   = serializer.data.get('done_s')
            reward_s = serializer.data.get('reward_s')
            score_s = serializer.data.get('score_s')
            col_l = serializer.data.get('col_l')
            col_r = serializer.data.get('col_r')
            col_u = serializer.data.get('col_u')
            col_d = serializer.data.get('col_d')
            mode_s = serializer.data.get('mode_s')
            
            if(mode_s=="P" and status=="User"):
                agent=agent2
            elif(mode_s=="P" and status!="User"):
                agent = agent3
            else:
                agent=agent1
            train(agent,head_x,head_y,food_x,food_y,direction_s,col_l,col_r,col_u,col_d,done_s,reward_s,score_s,mode_s)
            if(direction_s=="RIGHT"):
                dir = Direction.RIGHT
            elif(direction_s=="DOWN"):
                dir = Direction.DOWN
            elif(direction_s=="UP"):
                dir = Direction.UP
            elif(direction_s=="LEFT"):
                dir = Direction.LEFT
            clock_wise = [Direction.RIGHT,Direction.DOWN,Direction.LEFT,Direction.UP]
            idx = clock_wise.index(dir)
            if np.array_equal(agent.final_move,[1,0,0]):
                new_dir = clock_wise[idx]
            elif np.array_equal(agent.final_move,[0,1,0]):
                next_idx = (idx + 1) % 4
                new_dir = clock_wise[next_idx] #right Turn
            else:
                next_idx = (idx - 1) % 4
                new_dir = clock_wise[next_idx] 
            
            if(new_dir == Direction.RIGHT):
                new_dir = 'RIGHT'
            elif(new_dir==Direction.LEFT):
                new_dir = 'LEFT'
            elif(new_dir==Direction.UP):
                new_dir = 'UP'
            elif(new_dir==Direction.DOWN):
                new_dir = 'DOWN'
            # print("Old_dir= ",direction_s," new_dir= ",new_dir)
            data ={
                'next': new_dir,
                'user': status,
                'username': status2
            }
            
            # print(data)
            return JsonResponse(data)
        return Response({'Bad Request': 'Invalid data...'})
    
class createUser(APIView):
    serializer_class = UserSerializer
    
    def post(self,request,format=None):
        print("Creating User...")
        serializer = self.serializer_class(data=request.data)
        x = user()
        if serializer.is_valid():
            x.username = serializer.data.get('username')
            x.name =serializer.data.get('name')
            x.email = serializer.data.get('email')
            x.password = serializer.data.get('password')
            buffer = BytesIO()
            buffer = agent1.model.buffer_save()
            filename = x.username+".pth"
            default_storage.save(filename,buffer)
            x.save()       
        else:
            return Response({'Bad Request': 'Invalid data...'})
        return Response({'Bad Request': 'Invalid data...'})

class login_getname(APIView):
    serializer_class = Login_getuserSerializer
    def post(self,request,format=None):
        # print("getname")
        global image_path
        serializer = self.serializer_class(data=request.data)
        x = user()
        if serializer.is_valid():
            x.name = serializer.data.get('name')
            print(status)
            if(status!="null"):
                data={
                    'name': status,
                    'path': image_path
                }
                print(status)
                return (JsonResponse(data))
            else:
                data={
                    'name': "User",
                    'path': "./static/images/avatar1.png"
                }
                return (JsonResponse(data))
            
        else:
            return Response({'Bad Request': 'Invalid data...'})
        return Response({'Bad Request': 'Invalid data...'})

class loginUser(APIView):
    serializer_class = LoginSerializer
    global image_path
    
        
    def post(self,request,format=None):
        print("called...")
        global status
        global status2
        global agent3
        global image_path
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print("Connecting")
            # serializer.data.get('username'),serializer.data.get('password')
            queryset = user.objects.all()
            flag = False
            for i in range(len(queryset)):
                if(queryset[i].username == serializer.data.get('username')):
                    if(queryset[i].password == serializer.data.get('password')):
                        print("logined")
                        flag = True
                        status = queryset[i].name
                        status2 = serializer.data.get('username')
                        print(status)
            
            if(flag):  
                session = Session('AKIA2RYM7JRINBRG67CU','iB8TRmYCI5shAf7v5i2z/zQv6y7eEcC8RdezK1hQ')
                s3 = session.resource('s3')
                bucket = 'snakeai'
                mybucket = s3.Bucket(bucket)
                for s3_files in mybucket.objects.all():
                    print(s3_files.key)
                file_path = './api/downloads/'+serializer.data.get('username')+'.pth'
                try:
                    mybucket.download_file(serializer.data.get('username')+'.pth',file_path)
                    agent3 = Agent(2,file_path)   
                except:
                    print("File Not Found")
                file_path='./frontend/static/Download/'+serializer.data.get('username')+'_img.png'
                source = 'Images/'+serializer.data.get('username')+'_img.png'   
                try:
                    mybucket.download_file(source,file_path)
                    image_path = './static/Download/'+serializer.data.get('username')+'_img.png'
                except:
                    print("File Not Found")
                    image_path="./static/images/avatar1.png"
                data = {
                    'status': "verified",
                    'name': queryset[i].name,
                    'uname': status2,
                }
            else:
                data = {
                    'status': "invalid"
                }
            return JsonResponse(data)
        else:
            # print(serializer.data.get('username'),serializer.data.get('password'))
            return Response({'Bad Request': 'Invalid data...'})
        return Response({'Bad Request': 'Invalid data...'})

class logoutUser(APIView):
    serializer_class = LoginSerializer
    def post(self,request,format=None):
        global status,status2
        global image_path
        serializer = self.serializer_class(data=request.data)
        image_path = "./static/images/avatar1.png"
        try:
            os.remove("./api/downloads/"+status2+".pth")
            os.remove("./frontend/static/Download/"+status2+"_img.png")
        except:
            print("No file exist")
        status="User"
        status2=""
        
        
        return JsonResponse({'status': "done"})

class gameOver(APIView):
    serializer_class = gameOverSerializer
    print("Inside gameover class")
    def post(self,request,format=None):
        print("inside post ")
        serializer = self.serializer_class(data=request.data)
        x = user_stats()
        y = trained_model()
        if serializer.is_valid() and status!="User":
            print("inside serializer")
            username = serializer.data.get('username')
            score = serializer.data.get('score')
            date = datetime.datetime.now()
            t = date.strftime("%x")+" "+date.strftime("%X")
            x.score = score
            x.username = username
            x.time = t
            buffer = BytesIO()
            buffer = agent1.model.buffer_save()
            filename = username+".pth"
            default_storage.save(filename,buffer)
            
            if x.score != 0:
                x.save()
                y.save()
            print(username,score,t)
            return Response({'Bad Request': 'Invalid data...'})
        else:
            
            return Response({'Bad Request': 'Invalid data...'})

class getScore(APIView):
    serializer_class = getScoreSerializer
    def post(self,request,format=None):
        serializer = self.serializer_class(data=request.data)
        x = user_stats()
        y = trained_model()
        
        # session = Session('AKIA2RYM7JRINBRG67CU','iB8TRmYCI5shAf7v5i2z/zQv6y7eEcC8RdezK1hQ')
        # s3 = session.resource('s3')
        # bucket = 'snakeai'
        # mybucket = s3.Bucket(bucket)
        # for s3_files in mybucket.objects.all():
        #     print(s3_files.key)
        # mybucket.download_file('user1.pth','./api/downloads/user.pth')
        # print(file.read())
        # with BytesIO() as f:
        #     joblib.dump(file.read(), f)
        #     f.seek(0)
        # default_storage.save("Trained1.pth", file)
        lst = []
        max = 0
        if serializer.is_valid():
            queryset = user_stats.objects.all()
            for i in range(len(queryset)):
                if(queryset[i].username == status):
                    d={}
                    d['score'] = queryset[i].score
                    d['time']  = queryset[i].time
                    lst.append(d)
                    if(queryset[i].score>max):
                        max = queryset[i].score
        data={
            'username': status,
            'list': lst,
            'highest': max
        }
        return JsonResponse(data) 

class UploadImage(APIView):
    serializer_class = imageDataSerializer
    
    def post(self,request,format=None):
        print("Uploading Image...")
        x = image_data()
        print(request.data)
        data = request.FILES['image']
        username = request.POST.get('username')
        print(data)
        print(username)
        default_storage.save("/Images/"+username+"_img.png",ContentFile(data.read()))
        serializer = self.serializer_class(data=request.data)
        # if serializer.is_valid():
        #     print("valid data")
        #     print(serializer.data.get('image'))
        #     x.image = serializer.data.get('image')
            # x.save()
            # s3 = boto3.client('s3', aws_access_key_id='AKIA2RYM7JRINBRG67CU',
            #           aws_secret_access_key='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')
            # try:
            #     s3.upload_file(serializer.data.get('image'), 'snakeai', 'Images')
            #     print("Upload Successful")
            #     return True
            # except FileNotFoundError:
            #     print("The file was not found")
            #     return False
            # except NoCredentialsError:
            #     print("Crededential")
        # else:
        #     print(serializer.errors)
        return Response({'Bad Request': 'Invalid data...'})