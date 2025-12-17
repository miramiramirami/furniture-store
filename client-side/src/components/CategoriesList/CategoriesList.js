import { useCategories } from '../../hooks/categories/useCategories'
import { CategoryCard } from '../CategoryCard/CategoryCard'
import styles from './CategoriesList.module.scss'

export function CategoriesList() {
	const { categories, loading, error } = useCategories()

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error - {error}</div>
	if (!categories || categories.length === 0)
		return <div>Categories not found</div>

	const groups = []
	for (let i = 0; i < categories.length; i += 3) {
		groups.push(categories.slice(i, i + 3))
	}

	return (
		<div className={styles.categoriesGrid}>
			{groups.map((group, groupIndex) => {
				if (groupIndex % 2 === 0) {
					return (
						<>
							{group[0] && (
								<CategoryCard
									key={group[0].id}
									category={group[0]}
									size='large'
									column='left'
								/>
							)}
							<div className={styles.rightColumn}>
								{group[1] && (
									<CategoryCard
										key={group[1].id}
										category={group[1]}
										size='small'
									/>
								)}
								{group[2] && (
									<CategoryCard
										key={group[2].id}
										category={group[2]}
										size='small'
									/>
								)}
							</div>
						</>
					)
				} else {
					return (
						<>
							<div className={styles.leftColumn}>
								{group[0] && (
									<CategoryCard
										key={group[0].id}
										category={group[0]}
										size='small'
									/>
								)}
								{group[1] && (
									<CategoryCard
										key={group[1].id}
										category={group[1]}
										size='small'
									/>
								)}
							</div>
							{group[2] && (
								<CategoryCard
									key={group[2].id}
									category={group[2]}
									size='large'
									column='right'
								/>
							)}
						</>
					)
				}
			})}
		</div>
	)
}
