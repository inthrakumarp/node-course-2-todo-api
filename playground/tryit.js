var x = 5;
var y = 1;

var arr = [9,10,10];
var jumps = 0;
var metersCrossed = 0;
console.log(arr.length);

for(i=0; i < arr.length; i++ ){
    jumps = jumps+1;
    metersCrossed = metersCrossed + x;
    console.log('jumps1', jumps);
    console.log('metersCrossed1', metersCrossed);
    if(metersCrossed < arr[i]){
        metersCrossed = metersCrossed - y;
        console.log('jumps2',jumps);
        console.log('metersCrossed2',metersCrossed);
        while(metersCrossed < arr[i]){
            jumps = jumps +1;
            metersCrossed = metersCrossed + x;
            if(metersCrossed < arr[i]   ){
               metersCrossed = metersCrossed - y; 
            }
            console.log('jumps3',jumps);
            console.log('metersCrossed3',metersCrossed);
        }
    }
    metersCrossed = 0;
    //console.log(arr[i]);
}

console.log('jumps : ', jumps);