import React from "react"

import "./MLPOffset.css"

type State =
{

};

export interface MLPProps
{
    initial: boolean
};

export default class MLPOffset extends React.Component<MLPProps>
{
    constructor(props: MLPProps)
    {
        super(props);
    }
    
    render(): JSX.Element
    {
        if (this.props.initial)
        {
            return (
                <div className="mlp_offset">
                    <input type="text" placeholder="Initial Address"></input>
                    <select>
                        <option value="float">int32</option>
                        <option value="float">int64</option>
                        <option value="float">float</option>
                        <option value="float">double</option>
                        <option value="float">char</option>
                        <option value="float">other</option>
                    </select>
                </div>
            );
        }
        else
        {
            return (
                <div className="mlp_offset">
                    <input type="text" placeholder="Offset"></input>
                    <select>
                        <option value="float">float</option>
                        <option value="float">int</option>
                    </select>
                    <button type="button">Delete offset</button>
                </div>
            );
        }
    }
}