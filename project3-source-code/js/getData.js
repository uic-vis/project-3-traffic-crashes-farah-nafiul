const yearlyStatsFunction = (deathCountData)=>{
    const yearSummary = {};
    const resultset = [];
  
    for(let death of deathCountData){
      const year = death.year;
      if(year !== 1949 && year !== 2013){
        if(!(year in yearSummary)){
        yearSummary[year] = {'total_film' : 0, 'body_count': 0, 'total_length': 0, 'total_rating' : 0}
        }
        yearSummary[year]['total_film'] += 1;
        yearSummary[year]['body_count'] += death.bodyCount;
        yearSummary[year]['total_length'] += death.length;
        yearSummary[year]['total_rating'] += death.imdbRating;
      }
      
    }
    for(let year in yearSummary){
        const currentobj = {
        'year': +year, 
        'total_film': yearSummary[year]['total_film'], 
        'body_count': yearSummary[year]['body_count'],
        'total_length': yearSummary[year]['total_length'], 
        'total_rating': yearSummary[year]['total_rating'],
        'averageBody': yearSummary[year]['body_count'] / yearSummary[year]['total_film'],
        'averageLength': yearSummary[year]['total_length'] / yearSummary[year]['total_film'],
        'averageRating': yearSummary[year]['total_rating'] / yearSummary[year]['total_film'],
          
      };
        
      resultset.push(currentobj);
    }
  
    return resultset
  }


  const decadeStatsFunction = (yearly_stats) =>{
    const result = []
    for(let year = 1951; year <= yearly_stats[yearly_stats.length-1].year; year+=10){
      let decade = {'year': year, 'end': year+9, 'total_film': 0, 'body_count': 0, 'total_length' : 0, 'total_rating': 0}
      for (let each of yearly_stats){
        // result.push(each)
        if(each.year >= year && each.year < year+10){ //1951 - 1960
          decade.total_film += each.total_film;
          decade.body_count += each.body_count;     
          decade.total_length += each.total_length; 
          decade.total_rating += each.total_rating; 
        }
      }
      decade.averageBody = decade.body_count / decade.total_film;
      decade.averageLength = decade.total_length / decade.total_film;
      decade.averageRating = decade.total_rating / decade.total_film;
      result.push(decade);
    } 
    return result
}