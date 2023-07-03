const getData = async () => {
	const res = await fetch(
		'https://api.openweathermap.org/data/2.5/forecast?q=Moscow&units=metric&appid=key',
		{
			next: { revalidate: 60 },
		}
	);
	const data = await res.json();

	return data;
};

export default async function Home() {
	const data = await getData();

	const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const sortedByDays = {};

	const sortedByMidday = data.list.filter((item) => {
		if (sortedByDays[item.dt_txt.split(' ')[0]]) {
			if (
				sortedByDays[item.dt_txt.split(' ')[0]][0] > item.main.temp_min
			) {
				sortedByDays[item.dt_txt.split(' ')[0]][0] = item.main.temp_min;
			}
			if (
				sortedByDays[item.dt_txt.split(' ')[0]][1] < item.main.temp_max
			) {
				sortedByDays[item.dt_txt.split(' ')[0]][1] = item.main.temp_max;
			}
		} else {
			sortedByDays[item.dt_txt.split(' ')[0]] = [
				item.main.temp_min,
				item.main.temp_max,
			];
		}

		if (new Date(item.dt_txt).getHours() === 12) {
			return true;
		} else {
			return false;
		}
	});

	console.log(sortedByDays);

	return (
		<div className="flex flex-col items-center justify-center w-screen min-h-screen text-gray-700 p-10 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 ">
			<div className="w-full max-w-screen-sm bg-white p-10 rounded-xl ring-8 ring-white ring-opacity-40">
				<div className="flex justify-between">
					<div className="flex flex-col">
						<span className="text-6xl font-bold">
							{data.list[0].main.temp.toFixed()}°C
						</span>
						<span className="font-semibold mt-1 text-gray-500">
							Moscow, QLD
						</span>
					</div>
					<div
						className="bg-cover bg-center w-24 h-24"
						style={{
							backgroundImage:
								'url(https://openweathermap.org/img/wn/' +
								data.list[0].weather[0].icon +
								'@2x.png)',
						}}></div>
				</div>
				<div className="flex justify-between mt-12">
					{data.list.map((item, index) => {
						if (index > 4) {
							return null;
						}
						const date = new Date(item.dt_txt);
						return (
							<div className="flex flex-col items-center">
								<span className="font-semibold text-lg">
									{item.main.temp.toFixed()}°C
								</span>
								<span className="font-semibold mt-1 text-sm">
									{item.weather[0].main}
								</span>
								<div
									className="bg-cover bg-center w-24 h-24"
									style={{
										backgroundImage:
											'url(https://openweathermap.org/img/wn/' +
											item.weather[0].icon +
											'@2x.png)',
									}}></div>

								<span className="font-semibold mt-1 text-sm">
									{(date.getHours() % 12 >= 10
										? date.getHours() % 12
										: '0' + (date.getHours() % 12)) + ':00'}
								</span>
								<span className="text-xs font-semibold text-gray-400">
									{date.getHours() >= 12 ? 'PM' : 'AM'}
								</span>
							</div>
						);
					})}
				</div>
			</div>
			<div className="flex flex-col space-y-4 w-full max-w-screen-sm bg-white p-10 mt-10 rounded-xl ring-8 ring-white ring-opacity-40">
				{sortedByMidday.map((item, index) => {
					const date = new Date(item.dt_txt);
					return (
						<div className="flex justify-between items-center">
							<span className="font-semibold text-lg w-1/4">
								{daysOfWeek[date.getDay()]}, {date.getDate()}{' '}
								{months[date.getMonth()]}
							</span>
							<div className="flex items-center justify-end w-1/4 pr-10">
								<span className="font-semibold">
									{item.main.humidity}%
								</span>
								<svg
									className="w-6 h-6 fill-current ml-1"
									viewBox="0 0 16 20"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg">
									<g transform="matrix(1,0,0,1,-4,-2)">
										<path
											d="M17.66,8L12.71,3.06C12.32,2.67 11.69,2.67 11.3,3.06L6.34,8C4.78,9.56 4,11.64 4,13.64C4,15.64 4.78,17.75 6.34,19.31C7.9,20.87 9.95,21.66 12,21.66C14.05,21.66 16.1,20.87 17.66,19.31C19.22,17.75 20,15.64 20,13.64C20,11.64 19.22,9.56 17.66,8ZM6,14C6.01,12 6.62,10.73 7.76,9.6L12,5.27L16.24,9.65C17.38,10.77 17.99,12 18,14C18.016,17.296 14.96,19.809 12,19.74C9.069,19.672 5.982,17.655 6,14Z"
											style={{ fillRule: 'nonzero' }}
										/>
									</g>
								</svg>
							</div>
							<div
								className="bg-cover bg-center w-10 h-10"
								style={{
									backgroundImage:
										'url(https://openweathermap.org/img/wn/' +
										item.weather[0].icon +
										'@2x.png)',
								}}></div>
							<span className="font-semibold text-lg w-1/4 text-right">
								{sortedByDays[
									item.dt_txt.split(' ')[0]
								][0].toFixed()}
								° /{' '}
								{sortedByDays[
									item.dt_txt.split(' ')[0]
								][1].toFixed()}
								°
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
