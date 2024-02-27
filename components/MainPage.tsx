import Sidebar from '@/components/Sidebar'
import ChatsSection from '@/components/ChatsSection'

function MainPage() {
	return (
		<section className='w-full flex border-2 border-dark h-screen overflow-hidden relative'>
			<Sidebar />
			<ChatsSection />
		</section>
	)
}

export default MainPage