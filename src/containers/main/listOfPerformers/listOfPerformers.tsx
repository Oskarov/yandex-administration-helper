import React         from 'react';
import {useSelector} from "react-redux";
import {TStore}      from "../../../store/store";
import PerformerRow  from "./performerRow/performerRow";
import PerformerModal from "../control/performerModal/performerModal";

interface ListOfPerformersProps {

}

const ListOfPerformers: React.FC<ListOfPerformersProps> = () => {
    const {performers} = useSelector((state: TStore) => ({
        performers: state.performers.items,
    }));
    return <div>
        <div>
            <PerformerModal/>
        </div>
        <div>
            {performers.map(performer => <PerformerRow performer={performer} key={performer.uuid}/>)}
        </div>
    </div>;
}

export default ListOfPerformers;
