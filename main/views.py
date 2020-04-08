from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
import json
import numpy as np
import math

def index(request):
	return HttpResponse(loader.get_template('main/index.html').render())

def pruebas(request):
	return HttpResponse(loader.get_template('main/pruebas.html').render())

def simulation(request):
	rows = int(request.GET.get('rows'))
	columns = int(request.GET.get('columns'))
	properties = json.loads(request.GET.get('properties'))
	wells = json.loads(request.GET.get('wells'))
	lims = json.loads(request.GET.get('lims'))
	time = json.loads(request.GET.get('time'))
	#general = json.loads(request.GET.get('general'))

	kx, ky, por, pi, vis,ct, h, dx, dy = properties.values()
	wtype, q, pwf, s, rw = wells.values()

	ax = np.zeros((rows, columns))
	ay = np.zeros((rows, columns))
	v = np.zeros((rows, columns))
	ci = np.zeros((rows, columns))
	tl = np.zeros((rows, columns))
	tr = np.zeros((rows, columns))
	tu = np.zeros((rows, columns))
	td = np.zeros((rows, columns))

	wj = np.zeros((rows, columns))
	re = np.zeros((rows, columns))
		
	for i in range(rows):
		for j in range(columns):
			ax[i][j] = dy[i][j] * h[i][j]
			v[i][j] = ax[i][j] * dx[i][j] / 5.615
			ci[i][j] = ct[i][j] * v[i][j] * por[i][j]/time['dt']

	for i in range(rows):
		for j in range(columns):
			if j == 0:
				tl[i][j] = 0
			else:
				tl[i][j] = 2 * kx[i][j] * kx[i][j-1] * ax[i][j] * ax[i][j-1] * 0.001127 / (kx[i][j-1] * ax[i][j-1] * vis[i][j] * dx[i][j] + kx[i][j] * ax[i][j] * vis[i][j-1] * dx[i][j-1])

			if j == columns-1:
				tr[i][j] = 0
			else:
				tr[i][j] = 2 * kx[i][j] * kx[i][j+1] * ax[i][j] * ax[i][j+1] * 0.001127 / (kx[i][j+1] * ax[i][j+1] * vis[i][j] * dx[i][j] + kx[i][j] * ax[i][j] * vis[i][j+1] * dx[i][j+1])

			if i == 0:
				tu[i][j] = 0
			else:
				tu[i][j] = 2 * ky[i][j] * ky[i-1][j] * ax[i][j] * ax[i-1][j] * 0.001127 / (ky[i-1][j] * ax[i-1][j] * vis[i-1][j] * dx[i][j] + ky[i][j] * ax[i][j] * vis[i-1][j] * dx[i-1][j])

			if i == rows-1:
				td[i][j] = 0
			else:
				td[i][j] = 2 * ky[i][j] * ky[i+1][j] * ax[i][j] * ax[i+1][j] * 0.001127 / (ky[i+1][j] * ax[i+1][j] * vis[i][j] * dx[i][j] + ky[i][j] * ax[i][j] * vis[i+1][j] * dx[i+1][j])

	for i in range(rows):
		for j in range(columns):
			re[i][j] = 0.14 * math.sqrt(dx[i][j]**2 + dy[i][j]**2)

			k = kx[i][j]

			if rows > 1 and columns > 1:
				k = math.sqrt(kx[i][j] * ky[i][j])

			wj[i][j] = 0.001127 * 2 * math.pi * k * h[i][j] / (vis[i][j] * (math.log(re[i][j] / rw[i][j]) + s[i][j]))

	pressures = []
	pressures.append(np.asarray(pi).reshape(rows * columns).tolist())

	"""if lims['l'] != 0:
		columns -= 1

	if lims['r'] != 0:
		columns -= 1

	if lims['u'] != 0:
		rows -= 1

	if lims['d'] != 0:	
		rows -= 1"""

	for t in range(1):
		coef = np.zeros((rows * columns, rows * columns))
		r = np.zeros(rows * columns)

		pd = ''

		for i in range(rows):
			for j in range(columns):
				pos = ijToPos(i, j, columns)
				posr = ijToPos(i, j+1, columns)
				posl = ijToPos(i, j-1, columns)
				posu = ijToPos(i-1, j, columns)
				posd = ijToPos(i+1, j, columns)

				mainDiagonal = ci[i][j]

				if j != 0:
					coef[pos][posl] = tl[i][j]
					mainDiagonal += tl[i][j]

				if j != columns-1:
					coef[pos][posr] = tr[i][j]
					mainDiagonal += tr[i][j]

				if i != 0:
					coef[pos][posu] = tu[i][j]
					mainDiagonal += tu[i][j]

				if i != rows-1:
					coef[pos][posd] = td[i][j]
					mainDiagonal += td[i][j]

				if pwf[i][j] != 0:
					mainDiagonal += wj[i][j]


				coef[pos][pos] = -(mainDiagonal)

				r[pos] = -(pressures[t][pos] * ci[i][j]) - (pwf[i][j] * wj[i][j]) - q[i][j]

				"""if lims['l'] != 0 and j == 0:
					r[pos] += -tl[i][j] * lims['l']

				if lims['r'] != 0 and j == columns-1:
					r[pos] += -tr[i][j] * lims['r']

				if lims['u'] != 0 and i == 0:
					r[pos] += -tu[i][j] * lims['u']

				if lims['d'] != 0 and j == rows-1:
					r[pos] += -td[i][j] * lims['d']"""

		coefInv = np.linalg.inv(coef)
		pf = np.matmul(coefInv, r)

		pressures.append(pf.tolist())

	return JsonResponse({'ff': str(type(por)), 'gg': ''}, safe=False)


#utils
def ijToPos(i, j, columns):
	return i * columns + j

def cutMatrix():
	print('f')