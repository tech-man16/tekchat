
// const CurrentUserPage = ({params}:{params:{user: string}})=>{
//     return(
//         <div> {params.user} </div>
//     )
// }

// export default CurrentUserPage;

// Define the type where params is a Promise
interface PageProps {
  params: Promise<{ user: string }>;
}
export async function generateStaticParams() {
  return [{ user: "manas" }, { user: "guest" }];
}

const CurrentUserPage = async ({ params }: PageProps) => {
  // Await the params promise to get the data
  const { user } = await params;

  return (
    <div>
      User: {user}
    </div>
  );
};

export default CurrentUserPage;