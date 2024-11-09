import {Project} from './project.model'

export interface projectResponse{
    status: number,
    message: string,
    data:Project | Project[]
}