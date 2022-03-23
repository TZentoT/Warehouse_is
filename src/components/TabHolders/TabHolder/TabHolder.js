import React from "react";
import './TabHolder.css';
import { useLocation, useNavigate } from 'react-router-dom'

export default function TabHolder(props){
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div class="tabHolder">
            {props.tabs.map(item=>{
                if (location.pathname.split("/")[1] == item.href.split("/")[1]){
                    return (
                        <div class="tab selected">
                            <a>{item.title}</a>
                        </div>
                    )
                } else{
                    return(
                        <div class="tab unselected" onClick={()=>{
                            navigate(item.href + item.basicHref)
                        }}>
                            <a>{item.title}</a>
                        </div>
                    )
                }
            })}
        </div>
    )
}