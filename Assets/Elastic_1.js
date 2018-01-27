#pragma strict

public var Elastic: GameObject;
private var trueorfalse : int;
var render : Renderer;
function Start () {
    trueorfalse= 0 ;
    render =  GetComponent(Renderer);
}

function Update () {
	
}
function TaskOnClick()
{
    var targetScript : falconBehavior = Elastic.GetComponent(falconBehavior);
    if(trueorfalse == 1)
    {
        targetScript.myTypeFunction = typeFunction.Elastic_1;
        render = Elastic.GetComponent(Renderer);
        render.material= targetScript.mat[0];
        trueorfalse=0;
    }
    else
    {
        targetScript.myTypeFunction = typeFunction.Elastic_2;
        render = Elastic.GetComponent(Renderer);
        render.material = targetScript. mat[1];
        trueorfalse=1;
    }

}