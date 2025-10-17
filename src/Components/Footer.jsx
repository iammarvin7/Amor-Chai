import '../App.css'

const Footer = () => {
    const today = new Date();
    const year = today.getFullYear();
    return (
        <div className='footer'>
            <p> &#xA9; {year}, Amor + Chai | Made with  &#10084;</p>
        </div>
    )
}

export default Footer