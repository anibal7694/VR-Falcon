#pragma strict


public var radChange: GameObject;

function Start () {
	
}

function Update () {
	
}
function TaskOnClick() 
{
	
    var targetScript : falconBehavior = radChange.GetComponent(falconBehavior);
    //get script in other objects. Replace "main" with your js file name under your sphere object.

    //Debug.Log("You have clicked the button!");

    targetScript.radiusOrWidth += 0.5; //get variable functionType in other javascript file and change it.
        if(targetScript.radiusOrWidth >= 2.5)
        targetScript.radiusOrWidth=1.0;

    //Debug.Log(targetScript.functionType);
}