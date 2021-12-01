import React from 'react';

class Arraylist extends React.Component
{
    speed={
        myarray:["1x","1.5x","2x"]
    }
    render()
    {
        return(
            <div>
                <select>
                    {this.speed.myarray.map(data=>(
                        <option value={data}>{data}</option>
                    ))}
                </select>
            </div>
        );
    }

}
export default Arraylist;