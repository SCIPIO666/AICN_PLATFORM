import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyEnrolments} from '../api/enrolments'


const QUERY_KEY = ['myEnrolments']

export function useMyEnrolments(){
    const {data: enrolments=[],isLoading,isError,error}=useQuery({
        queryKey:   QUERY_KEY,
        queryFn: getMyEnrolments
    })

    return {
        enrolments,
        isLoading,
        isError,
        error
    }
}