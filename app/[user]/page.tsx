
const CurrentUserPage = ({params}:{params:{user: string}})=>{
    return(
        <div> {params.user} </div>
    )
}

export default CurrentUserPage;