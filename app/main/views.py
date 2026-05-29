from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def index(request):
    '''функция для отображения главной страницы'''
    context = {
        'title' : 'Home - главная страница',
        'content' : 'La Douceur — Магазин женского нижнего белья',
    
    }
    return render(request, 'main/index.html', context)

def about(request):
    '''функция для отображения главной страницы'''
    return HttpResponse('About page')

