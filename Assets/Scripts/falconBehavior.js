#pragma strict

private var plugin: falconBehaviour = new falconBehaviour();
public var smallSphere : GameObject;
public var radiusOrWidth : float = 1.0f;
public var mesh : Mesh[];
private var previousServoPos : Vector3;
private var saveSmallSpherePos : Vector3;
var elastic1Values : float[]; //elastic1(kObject : float, d : float, dMax : float, FMax : float)
public var elastic2Values : float[]; //elastic2(kObject1 : float, kObject2 : float, d : float, dIsc : float, dMax : float, FMax : float)
public var pushButtonValues : float[]; //pushButton(kObject1 : float, kObject2 : float, d : float, m : float, n : float, FResidual : float)
public var wallValues : float[]; //wall(kObject : float, d : float, B : float)
public var exponentialValues : float[]; //exponential(x : float, percentage : float, valuePercentage : float)
public var logValues : float[]; //log(x : float, a : float, b : float, c :float)
public var nlogValues : float[]; //ln(x : float)
public var coeffLinear : float=1.0; 
public enum typeFunction{Linear, Exponential, Log, Elastic_1, Elastic_2, Push_Button, Wall};
public var myTypeFunction : typeFunction = typeFunction.Elastic_1;
//public var myTypeFunction : typeFunction.Linear;
public enum typeObject{Sphere, Wall};
public var mat: Material[];

function Start () 
{
    // Add this for initialization
    plugin.StartHapticsSystem();
    StartCoroutine(plugin.InitHapticsSystem());
}
function OnApplicationQuit ()
{
    plugin.applicationQuit();
}
function Update()
{
    
    var myTypeObject : typeObject = typeObject.Sphere;
    switch (myTypeObject)
    {
        case typeObject.Sphere:
            GetComponent(MeshFilter).mesh = mesh[0];
            transform.localScale = Vector3(radiusOrWidth +
            radiusOrWidth*0.2, radiusOrWidth + radiusOrWidth*0.2, radiusOrWidth +
            radiusOrWidth*0.2);
            break;
        case typeObject.Wall:
            GetComponent(MeshFilter).mesh = mesh[1];
            transform.localScale = Vector3(0.7f, 0.7f, 0.7f);
            break;
        default:
            GetComponent(MeshFilter).mesh = mesh[0];
            break;
    }
}
function FixedUpdate ()
{
    
    var myTypeObject : typeObject = typeObject.Sphere;
    var currentServoPos : Vector3 = plugin.GetServoPos();
    print(currentServoPos);
    var velocity : Vector3 = (currentServoPos - previousServoPos) / (Time.fixedDeltaTime);
    previousServoPos = currentServoPos;
    smallSphere.transform.position = currentServoPos;
    var force : Vector3 = Vector3.zero;
    var distance : float = 0.0f;
    switch (myTypeObject)
    {
        case typeObject.Sphere:
            force = Vector3(currentServoPos.x, currentServoPos.y, -
            currentServoPos.z);
            distance = Vector3.Distance(Vector3.zero, currentServoPos);
            break;
        case typeObject.Wall:
            force = Vector3(0, 0, Mathf.Abs(currentServoPos.z));
            distance = transform.position.z - currentServoPos.z;
            if(distance < 0)
                distance = 0.01;
            break;
        default:
            break;
    }
    var percentageDistance : float = (radiusOrWidth - distance) /
    radiusOrWidth;
    if(percentageDistance < 0)
        percentageDistance = 0;
    if(distance < radiusOrWidth)
        distance = radiusOrWidth - distance;
    else
        distance = 0;
    var coeff : float = 1.0f;
    if(radiusOrWidth - distance > 0)
    {
        switch (myTypeFunction)
        {
            case typeFunction.Elastic_1:
                coeff = elastic1(elastic1Values[0], distance, elastic1Values[1], elastic1Values[2]);
                print(elastic1Values[0]);
                break;
            case typeFunction.Elastic_2:
                coeff = elastic2(elastic1Values[0],
                elastic2Values[1], distance, elastic2Values[2], elastic2Values[3],
                elastic2Values[4]);
                break;
            case typeFunction.Push_Button:
                coeff = pushButton(pushButtonValues[0],
                pushButtonValues[1], distance, pushButtonValues[2], pushButtonValues[3],
                pushButtonValues[4]);
                break;
            case typeFunction.Wall:
                coeff = wall(wallValues[0], distance, wallValues[1]);
                break;
            case typeFunction.Linear:
                coeff = percentageDistance * coeffLinear;
                break;
            case typeFunction.Exponential:
                coeff = exponential(percentageDistance,
                exponentialValues[0], exponentialValues[1]);
                break;
            case typeFunction.Log:
                coeff = log(percentageDistance * 10, logValues[0],
                logValues[1], logValues[2]);
                break;
            default:
                break;
        }
    }
    plugin.SetServo(force * coeff);
    print(force * coeff);
}
function elastic1(kObject : float, d : float, dMax : float, FMax : float) : float
{
    if(d > 0 && d < dMax)
        return kObject * d;
    else if(d > dMax)
        return FMax;
}
function elastic2(kObject1 : float, kObject2 : float, d : float, dIsc : float, dMax : float, FMax : float) : float
{
    if(d >= 0 && d < dIsc)
        return kObject1 * d;
    else if(d >= dIsc && d < dMax)
        return kObject1 * dIsc + kObject2 * (d - dIsc);
    else if(d >= dMax)
        return FMax;
    return 0.0f;
}
function pushButton(kObject1 : float, kObject2 : float, d : float, m : float, n : float, FResidual : float) : float
{
    if(d < m)
        var uM : float = 0.0;
    if(d < n)
        var uN : float = 0.0f;
    return kObject1 * d * (1 - uM) + FResidual * uM + kObject2 * (d - n) * uN;
}
function wall(kObject : float, d : float, B : float) : float
{
    if(d < 0.0f)
        return kObject * d + B * d;
    if(d >= 0.0f)
        return kObject * d;
    return 0.0f;
}
function log(x : float, a : float, b : float, c : float) : float
{
    if(x < 0)
        x = 0;
    return a * Mathf.Log((x * b + 1) , c);
}
function ln(x : float) : float
{
    if(x < 0)
        x = 0;
    return Mathf.Log(x, 2.71828183);
}
function exponential(x : float, percentage : float, valuePercentage : float): float
{
    if(x < 0)
        x = 0;
    var k : float = ln(valuePercentage)/percentage;
    return Mathf.Exp(k * x);
}
