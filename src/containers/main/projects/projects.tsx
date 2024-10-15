import React         from 'react';
import {useSelector} from "react-redux";
import {TStore}      from "../../../store/store";
import {ITask}       from "../../../interfaces/ITask";
import Project       from "./project/project";

interface ProjectsProps {
}

const Projects: React.FC<ProjectsProps> = ({}) => {
    const projects = useSelector((state: TStore) => state.tracker.projects);
    return <div>
        {Object.keys(projects).map((project)=><Project number={project} key={projects[project].name} name={projects[project].name} isOpen={projects[project].isOpen} tasks={projects[project].tasks}/>)}
    </div>;
}

export default Projects;
