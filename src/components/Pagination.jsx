import React from "react";
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import {FlatButton, Toolbar, ToolbarGroup} from "material-ui";

class Pagination extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // page: 1,
        }
    }
    componentDidMount(){
    }
    setPage(page) {
        if(page>this.props.onChange(page)){

          this.setState({
             page:this.props.onChange(page)
          })
        }else{
           this.setState({
              page
            },()=>{this.props.onChange(page)}) 
        }
    }    
    render() {
        const {total} = this.props;
        const {page} = this.props;
        const allPage = Math.ceil(total / 10) || 1;
        return (
            allPage > 1 &&
            <Toolbar style={{background:"white"}}>
                <ToolbarGroup>
                    <div style={{fontSize:"32px",color:"#000"}}>
                        {
                            `${(page - 1) * 10 + 1}-${page * 10} of ${total}`
                        }
                    </div>
                    <div style={{marginLeft: '200px',color:"#000",fontSize:"40px"}}>
                        {
                            <FlatButton primary key="prev" label="上一页" icon={<ChevronLeft/>}
                                        disabled={page <= 1}
                                        onClick={()=>this.setPage(page-1)}
                                        />
                        }
                        {
                            `当前页：${page}`
                        }
                        {
                            <FlatButton primary key="next" label="下一页" icon={<ChevronRight/>}
                                        disabled={page === allPage}
                                        onClick={()=>this.setPage(page+1)} labelPosition="before"/>
                        }
                    </div>
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

export default Pagination

