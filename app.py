from flask import Flask, render_template,request,jsonify
from neo4j import GraphDatabase
from flask_cors import CORS
import re, datetime
import pandas as pd,json
from geopy.geocoders import Nominatim
import numpy as np

#uri = "bolt://100.26.172.97:36440"
#driver = GraphDatabase.driver(uri, auth=("neo4j", "discounts-schoolroom-transit"))
uri = "bolt://localhost:7687"
driver = GraphDatabase.driver(uri, auth=("neo4j", "12345"))


app= Flask(__name__)
CORS(app)

def df_to_geojson(df, properties, lat='latitude', lon='longitude'):
    geojson = {'type':'FeatureCollection', 'features':[]}
    for _, row in df.iterrows():
        feature = {'type':'Feature',
                   'properties':{},
                   'geometry':{'type':'Point',
                               'coordinates':[]}}
        feature['geometry']['coordinates'] = [row[lat],row[lon]]
        for prop in properties:
            feature['properties'][prop] = row[prop]        
        geojson['features'].append(feature)
    
    return geojson
    
@app.route('/app/mobilelogin',methods=['POST'])
def mobile():   
    db = driver.session()
    pid=request.json['pid']
    pin=int(request.json['pin'])
    params={'pid':pid,'pin':pin}
    results = db.run("MATCH(P:Person{pid:$pid,pin:$pin}) RETURN P.pid as PatientID,P.status as PersonStatus",params)
    for record in results:
        if not record['PatientID']:
            status="false"
            response={'status':status}
        else:
            status="true"
            response={'status':status,'pid':record["PatientID"],'personstatus':record["PersonStatus"]}
    return{"response":response}

@app.route('/app/getdatafromdb',methods=['POST'])
def authority():
    return{"response":"Working fine"}

@app.route('/app')
def index1(): 
    return {"message":"Working Fine from API Side for routing check"}

@app.route('/app/markinfectedPerson', methods=['POST'])
def index3():
    db = driver.session()
    name=request.json['ipid']
    params={'pid':name} 
    results=db.run("MATCH(P:Person{pid:$pid}) SET P.status='infected'",params)
    return{'response':"Successfully marked the infected person"}

@app.route('/app/post', methods=['POST'])
def index2():
    db = driver.session()
    pid=request.json['pid']
    datee=request.json['date']
    match = re.search('\d{4}-\d{2}-\d{2}', datee)
    date = datetime.datetime.strptime(match.group(), '%Y-%m-%d').date()
    date1=str(date.day)+'/'+str(date.month)+'/'+str(date.year)
    params={'pid':pid,'date':date1}
    data=[]
    results=db.run("MATCH(P:Person{pid:$pid}),(OP:Person),(H:Hour),(D:Day{uuid:$date}),(M:Month),(Y:Year),(P)-[r1:AT]->(H)<-[r2:AT]-(OP),(H)<-[:CONTAINS]-(D)<-[:CONTAINS]-(M)<-[:CONTAINS]-(Y)WHERE distance(r1.location,r2.location)<1000 SET OP.status =CASE WHEN distance(r1.location,r2.location)<300 THEN 'quarantine' ELSE 'precaution' END RETURN P.pid as InfectedPerson,OP.pid as NearbyPeople,distance(r1.location,r2.location) as Distance, H.value as TIME,D.value as Day,M.value as Month,Y.value as Year,r2.location.y as Latitude,r2.location.x as Longitude,r1.location.y as IPLatitude,r1.location.x as IPLongitude,OP.status as Status,P.status as IStatus",params)
    for record in results:
        if int(record['TIME'])<12:
            time=str(record['TIME'])+' AM'
        else:
            time=str(record['TIME'])+' PM'
        res={'pid':record['NearbyPeople'],'distance':record['Distance'],'month':record['Month'],'year':record['Year'],'day':record['Day'],'time':time,'latitude':record['Latitude'],'longitude':record['Longitude'],'iplatitude':record['IPLatitude'],'iplongitude':record['IPLongitude'],'ipid':record['InfectedPerson'],'status':record['Status'],'infstatus':record['IStatus']}
        data.append(res)
    return{'response':data}

@app.route('/app/heat',methods=['POST'])
def index4():
    db = driver.session()
    data =[]
    results=db.run("MATCH(P:Person) RETURN P.pid as PersonId, P.location.x as latitude, P.location.y as Longitude,P.status as Status")
    for record in results:
        data.append(record)
    df = pd.DataFrame(data,columns=['pid','latitude','longitude','status'])
    df['latitude'] = df['latitude'].astype(float)
    df['longitude'] = df['longitude'].astype(float)
    useful_columns = ['pid', 'status']
    geojson_dict = df_to_geojson(df, properties=useful_columns)
    geojson_str = json.dumps(geojson_dict, indent=2)
    file = geojson_str.replace('\n', '') 
    data = json.loads(file)
    return{'response':data}

@app.route('/app/zone',methods=['POST'])
def index5():
    geolocator = Nominatim(user_agent="covid-19-tracker")
    name=request.json['zone']
    location=geolocator.geocode(name,timeout=10000)
    lat=location.latitude
    long=location.longitude
    response={"lat":lat,"long":long}
    return{'response':response}

# @app.route('/app/showzone',methods=['POST'])
# def index6():
#     name=request.json['zone']
#     print(name)
#     df = pd.read_csv("H:/neo4j-community-3.5.14/import/kolkata.csv")
#     geolocator = Nominatim(user_agent="covid-19-tracker")
#     df['location']=df.apply(lambda row: geolocator.reverse(str(row['Latitude']) +","+ str(row['Longitude']),timeout=10000).address, axis=1)
#     df1=df.groupby(df['location']).agg(
#     latitude=pd.NamedAgg(column='Latitude',aggfunc=np.mean),
#     longitude=pd.NamedAgg(column='Longitude',aggfunc=np.mean),
#     count=pd.NamedAgg(column='location',aggfunc='count')
#     )
#     df1 = df1.reset_index(level=0, drop=True)
#     df1['location']=df1.apply(lambda row: geolocator.reverse(str(row['latitude']) +","+ str(row['longitude']),timeout=10000).address, axis=1)
#     response=df1.to_json(orient='records')
#     response=json.loads(response)
#     return{'response':response}

@app.route('/app/heatmapdetails',methods=['POST'])
def index7():
    state=request.json['state']
    db = driver.session()
    params={'state':state}
    results=db.run("MATCH(P:Person) WHERE P.address CONTAINS $state RETURN COUNT(P.pid) As InfectedPeople",params)
    for record in results:
        res={'state':state,'count':record['InfectedPeople']}
    return{'response':res}


@app.route('/app/showzone',methods=['POST'])
def index8():
    db = driver.session()
    name=request.json['zone']
    params={'state':name}
    results=db.run("MATCH(P:Person) WHERE P.address CONTAINS $state RETURN P.pid as PersonId, P.location.y as Latitude,P.location.x as Longitude, P.address as Address",params)
    data=[]
    for record in results:
        data.append(record)
    df = pd.DataFrame(data,columns=['pid','Latitude','Longitude','location'])
    geolocator = Nominatim(user_agent="covid-19-tracker")
    df1=df.groupby(df['location']).agg(
    latitude=pd.NamedAgg(column='Latitude',aggfunc=np.mean),
    longitude=pd.NamedAgg(column='Longitude',aggfunc=np.mean),
    count=pd.NamedAgg(column='location',aggfunc='count')
    )
    df1 = df1.reset_index(level=0, drop=True)
    df1['location']=df1.apply(lambda row: geolocator.reverse(str(row['latitude']) +","+ str(row['longitude']),timeout=10000).address, axis=1)
    response=df1.to_json(orient='records')
    response=json.loads(response)
    return{'response':response}