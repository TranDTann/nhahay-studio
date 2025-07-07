import './styles.css'

type TBlockHeaderProps = {
  title: string
}

const BlockHeader = ({ title }: TBlockHeaderProps) => {
  return <h1 className="block-header-post-title">{title}</h1>
}

export default BlockHeader
