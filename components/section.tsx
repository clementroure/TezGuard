interface Props {
	children: React.ReactNode
}

const Section = ({ children }: Props) => (
	<section className='mt-14 sm:mt-0'>{children}</section>
)

export default Section
