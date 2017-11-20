import pandas as pd
import random
import numpy as np
import sys

import scipy.stats as ss
from scipy.spatial.distance import cdist, pdist

import matplotlib
from sklearn import cluster as Kcluster, metrics as SK_Metrics
from sklearn.decomposition import PCA
from sklearn import manifold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import Normalizer
from matplotlib import pyplot
from scipy import cluster

df1=pd.read_csv("F:\SBU\Spring 2017\CSE564\Projects\Project 2\Mini Project 2\OJ.csv")

def elbow(df, n):
    kMeansVar = [Kcluster.KMeans(n_clusters=k).fit(df.values) for k in range(1, n)]
    centroids = [X.cluster_centers_ for X in kMeansVar]
    k_euclid = [cdist(df.values, cent) for cent in centroids]
    dist = [np.min(ke, axis=1) for ke in k_euclid]
    var = [sum(d**2) for d in dist]
    pyplot.plot(var)
    pyplot.title('Elbow Plot')
    pyplot.xlabel('Number of Clusters')
    pyplot.ylabel('Variance')
    pyplot.show()

def rS(dF,fract):
    rows=random.sample(list(dF.index),(int)(len(dF)*fract))
    return df1.ix[rows]

def aS(dF,fract,clusterCount):
    k_means = Kcluster.KMeans(n_clusters=clusterCount)
    k_means.fit(dF)
    dF['label'] = k_means.labels_
    adaptiveSampleRows = []
    for i in range(clusterCount):
       adaptiveSampleRows.append(dF.ix[random.sample(list(dF[dF['label']==i].index),(int)(len(dF[dF['label']==i])*fract))])
    adaptiveSample = pd.concat(adaptiveSampleRows)
    del adaptiveSample['label']
    return adaptiveSample

def find_pca(data_frame):
    pca = PCA(n_components=2)
    variable=pd.DataFrame(pca.fit_transform(data_frame))
    print(variable)
    return variable

def screeplot(A):
    X,Y = np.linalg.eig(np.cov(A.transpose()))
    svals = np.arange(18)+1
    conv = pd.DataFrame(data=X[::],index=svals,columns=["eigs"])
    conv.to_csv("eig.csv", sep=',')
    
    pyplot.plot(svals, X, 'bx-', linewidth=2)
    pyplot.title('Scree Plot')
    pyplot.xlabel('Principal Component')
    pyplot.ylabel('Eigenvalue')
    leg = pyplot.legend(['Eigenvalues from SVD'], loc='best', borderpad=0.3,
                 shadow=False, prop=matplotlib.font_manager.FontProperties(size='small'),
                 markerscale=0.4)
    pyplot.show()

def highest_loadings(data_frame):
    pca=PCA(n_components=2)
    X_t = pca.fit_transform(data_frame)
    loadings=pca.components_
    loadings=[i**2 for i in loadings]
    y=[sum(x) for x in zip(*loadings)]
    print(y)

def find_MDS(dF, type):
    dis_mat = SK_Metrics.pairwise_distances(dF, metric = type)
    mds = manifold.MDS(n_components=2, dissimilarity='precomputed')
    return pd.DataFrame(mds.fit_transform(dis_mat))

data_directory = "F:/SBU/Spring 2017/CSE564/Projects/Project 2/" 
def createFile(random_sample, adaptive_sample, file_name):
    random_sample.columns = ["r1","r2"]
    adaptive_sample.columns = ["a1","a2"]
    sample = random_sample.join([adaptive_sample])

    file_name = data_directory+file_name
    sample.to_csv(file_name, sep=',')

def cF(data_frame,file_name):
    data_frame.columns=["Pur3ase","WeekofPur3ase","StoreID","Price3","Price4","Disc3","Disc4","Special3","Special4","Loyal3","SalePrice4","SalePrice3","PriceDiff","Store7","PctDisc4","PctDisc3","ListPriceDiff","STORE"]
    file_name=data_directory+file_name+".csv"
    data_frame.to_csv(file_name,sep=',')

def calculate_values(random_sample, adaptive_sample,function,file_name):
    createFile(function(random_sample), function(adaptive_sample),file_name +".csv")


random_sample=rS(df1,0.2)
cF(random_sample,"rs")
elbow(df1,15)
adaptive_sample = aS(df1,0.2,4)
cF(adaptive_sample,"as")
screeplot(random_sample)
highest_loadings(random_sample)
print("adaptive")
highest_loadings(adaptive_sample)
calculate_values(random_sample,adaptive_sample,find_pca,"pca2")
list_mds = ["euclidean","correlation"]
for type_mds in list_mds:
    createFile(find_MDS(random_sample,type_mds),find_MDS(adaptive_sample,type_mds),type_mds + ".csv")
