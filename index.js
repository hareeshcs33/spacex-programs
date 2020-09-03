(() => {
    
    console.log("spacex");

    const API_URL_BASE = 'https://api.spacexdata.com/v3/launches';
    const QN_MARK = '?';
    const API_URL_FIRST_100 = `${API_URL_BASE}${QN_MARK}limit=100`;
    const targetEl = document.getElementById('programs');
    const ACTIVE_CLASS_NAME = 'active-cta';

    let byYear = '';
    let byLaunchSuccess = '';
    let bySuccessLanding = '';

    loadData(API_URL_FIRST_100);

    const launchYearButtons = document.querySelectorAll('.launch-year-button-group button');
    const launchSuccessButtons = document.querySelectorAll('.launch-success-button-group button');
    const successLandingButtons = document.querySelectorAll('.success-landing-button-group button');

    if(launchYearButtons && launchYearButtons.length > 0){
        launchYearButtons.forEach(button => {
            button.addEventListener('click', (btn) => {
                addActive(launchYearButtons, btn);
                filterByLaunchYear(btn.target.textContent);
            });
        })
    }
    if(launchSuccessButtons && launchSuccessButtons.length > 0){
        launchSuccessButtons.forEach(button => {
            button.addEventListener('click', (btn) => {
                addActive(launchSuccessButtons, btn);
                filterByLaunchSuccess(btn.target.textContent);
            });
        })
    }
    if(successLandingButtons && successLandingButtons.length > 0){
        successLandingButtons.forEach(button => {
            button.addEventListener('click', (btn) => {
                addActive(successLandingButtons, btn);
                filterBySuccssLanding(btn.target.textContent);
            });
        })
    }

    function addActive(btnList, btn){
        if(!(btnList && btnList.length > 0) || !btn){
            return;
        }
        btnList.forEach(button => {
            button.classList.remove(ACTIVE_CLASS_NAME);
        });
        btn.target.classList.add(ACTIVE_CLASS_NAME);
    }

    function filterByLaunchYear(year){
        byYear = '&launch_year=' + year;
        url = `${API_URL_FIRST_100}${byYear}`
        if(byLaunchSuccess){
            url += byLaunchSuccess
        }
        if(bySuccessLanding){
            url += bySuccessLanding
        }
        loadData(url);
    }

    function filterByLaunchSuccess(val){
        byLaunchSuccess = '&launch_success=' + ((val === 'True') ? 'true' : 'false');
        url = `${API_URL_FIRST_100}${byLaunchSuccess}`
        if(bySuccessLanding){
            url += bySuccessLanding
        }
        if(byYear){
            url += byYear
        }
        loadData(url);
    }

    function filterBySuccssLanding(val){
        bySuccessLanding = '&land_success=' + ((val === 'True') ? 'true' : 'false');
        url = `${API_URL_FIRST_100}${bySuccessLanding}`
        if(byLaunchSuccess){
            url += byLaunchSuccess
        }
        if(byYear){
            url += byYear
        }
        loadData(url);
    }

    function loadData(url){
        fetch(url).then(response => {
            response.json().then(result => {
                populateCards(result);
            }, error => setError());
        }, error => setError());
    }

    function populateCards(programList){
        setLoading(true);
        if(programList && programList.length > 0){
            setLoading(false);
            programList.forEach(program => {
                targetEl.appendChild(getCard(program));
            });
            
        } else {
            setLoading(false);
            setNoData();
        }
    }

    function setLoading(value){
        targetEl.innerHTML = value ? 'Loading' : '';
    }

    function setNoData(){
        targetEl.innerHTML = 'No Data';
    }

    function setError(){
        targetEl.innerHTML = 'Error';
    }

    /**
     * to be user to clear all the filters
     */
    function clearFilters(){
        byYear = null;
        byLaunchSuccess = null;
        bySuccessLanding = null;
    }

    /**
     * method to construct program card
     */
    function getCard(program){
        const cardEl = document.createElement('div');
        cardEl.classList = 'col-12 col-md-6 col-lg-4 col-xl-3';
        cardEl.innerHTML = `
            <div class="card p-3 mb-3 border-0">
                <div class="card-header text-center img-box">
                    <img src="${program.links.mission_patch_small}" alt="${program.mission_name}" class="mission-img"/>
                </div>
                <div class="card-body p-0">
                    <div class="card-title">${program.mission_name} #${program.flight_number}</div>
                    <div class="mission-ids">
                        <label>Mission Ids:</label>
                        <ul>
                            <li>${program.mission_id}</li>
                        </ul>
                    </div>
                    <div class="label-value-block">
                        <label class="label">Launch Year:</label>
                        <span class="value">${program.launch_year}</span>
                    </div>
                    <div class="label-value-block">
                        <label class="label">Successful Launch:</label>
                        <span class="value">${program.launch_success}</span>
                    </div>
                    <div class="label-value-block">
                        <label class="label">Successful Landing:</label>
                        <span class="value">${program.launch_landing ? true : (program.launch_landing === false ? false : '---')}</span>
                    </div>
                </div>
            </div>
        `;
        return cardEl;
    }
  
})();
