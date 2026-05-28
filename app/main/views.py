from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def index(request):
    '''функция для отображения главной страницы'''
    context = {
        'title' : 'Home',
        'content' : 'Главная страница магазина - HOME',
        'list' : ['first', 'second'],
        'dict' : {'first' : 1},
        'is_aut' : False
    }
    return render(request, 'main/index.html', context)

def about(request):
    '''функция для отображения главной страницы'''
    return HttpResponse('About page')

