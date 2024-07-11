import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { selectChips, selectDrink, selectChocolate, resetCombo } from '../store/comboSlice';
import { OptionType } from '../utils/constants';
import CustomLabel from './CustomLabel';
import CustomLoader from './CustomLoader';
import  CombosData from '../assets/combos.json'

const ComboPicker: React.FC = () => {
    const dispatch = useDispatch();
    const { chips, drink, chocolate } = useSelector((state: RootState) => state.combo);
    const [combos, setCombos] = useState([]);
    const [selectedTab, setSelectedTab] = useState('chip');
    const [uniqueChips, setUniqueChips] = useState<any[]>([]);
    const [uniqueDrinks, setUniqueDrinks] = useState<any[]>([]);
    const [uniqueChocolates, setUniqueChocolates] = useState<any[]>([]);
    const [loader, setLoader] = useState<boolean>(true);



        useEffect(() => {
            //For fetching file from server side we will include this code below

            // fetch('/combos.json')
            //     .then((response) => {
            //         if (!response.ok) {
            //             throw new Error(`HTTP error! Status: ${response.status}`);
            //         }
            //         return response.json();
            //     })
            //     .then((data) => {
            //         setCombos(data.data);
            //         setUniqueChips([...new Set(data.data.map((combo: any) => combo.chips))]);
            //         setLoader(false)
            //     })
            //     .catch((error) => console.log('Error fetching combos:', error))

        // For importing data from local json file
                    let data:any = CombosData
                    setCombos(data?.data);
                    setUniqueChips([...new Set(data?.data?.map((combo: any) => combo.chips))]);
                     setLoader(false)
        }, [CombosData]);




    useEffect(() => {
        updateUniqueOptions();
    }, [combos, selectedTab]);

    useEffect(() => {
        handleDynamicOptions();
    }, [ chips, drink, chocolate]);

    const updateUniqueOptions = () => {

        switch (selectedTab) {
            case 'chip':
                setUniqueChips([...new Set(combos?.map((combo: any) => combo.chips))]) ;
                setUniqueDrinks([]);
                setUniqueChocolates([]);
                break;
            case 'drink':
                setUniqueDrinks([...new Set(combos?.map((combo: any) => combo.drink))]) ;
                setUniqueChocolates([]);
                setUniqueChips([])
                break;
            case 'chocolate':
                setUniqueChocolates([...new Set(combos?.map((combo: any) => combo.chocolate))]) ;
                setUniqueChips([])
                setUniqueDrinks([]);
                break;
            default:
                break;
        }
    };

    const updateOptionChange = (type:string) => {

        switch (selectedTab) {
            case 'chip':
                if(type === 'chip' ){
                    dispatch(selectDrink(null));
                    dispatch(selectChocolate(null));
                }

                if(type === 'drink'){
                    dispatch(selectChocolate(null));
                }

                break;
            case 'drink':
                if(type === 'drink' ){
                    dispatch(selectChips(null));
                    dispatch(selectChocolate(null));
                }

                if(type === 'chip'){
                    dispatch(selectChocolate(null));
                }
                break;
            case 'chocolate':
                if(type === 'chocolate' ){
                    dispatch(selectChips(null));
                    dispatch(selectDrink(null));
                }

                if(type === 'chip'){
                    dispatch(selectDrink(null));
                }


                break;
            default:
                break;
        }
    };

    const handleDynamicOptions = () => {

        switch (selectedTab) {
            case 'chip':
                if(chips){
                    setUniqueDrinks([...new Set(combos?.filter((combo: any) => combo.chips === chips).map((combo: any) => combo.drink))]) ;
                    setUniqueChocolates([])
                }
                if(chips && drink){
                    setUniqueChocolates([...new Set(combos?.filter((combo: any) => combo.chips === chips && combo.drink === drink).map((combo: any) => combo.chocolate))]) ;
                }
                break;
            case 'drink':
                if(drink){
                    setUniqueChips([...new Set(combos?.filter((combo: any) => combo.drink === drink).map((combo: any) => combo.chips))]) ;
                    setUniqueChocolates([])
                }
                if(chips && drink){
                    setUniqueChocolates([...new Set(combos?.filter((combo: any) => combo.chips === chips && combo.drink === drink).map((combo: any) => combo.chocolate))]) ;
                }
                break;
            case 'chocolate':
                if(chocolate){
                    setUniqueChips([...new Set(combos?.filter((combo: any) => combo.chocolate === chocolate).map((combo: any) => combo.chips))]) ;
                    setUniqueDrinks([])
                }
                if(chips && chocolate){
                    setUniqueDrinks([...new Set(combos?.filter((combo: any) => combo.chips === chips && combo.chocolate === chocolate).map((combo: any) => combo.drink))]) ;
                }
                break;
            default:
                break;
        }
    };

    const handleOptionChange = (type: OptionType, value: string) => {
        switch (type) {
            case 'chip':
                dispatch(selectChips(value));
                break;
            case 'drink':
                dispatch(selectDrink(value));
                break;
            case 'chocolate':
                dispatch(selectChocolate(value));
                break;
        }
        updateOptionChange(type);
    };

    const handleTabClick = (tab: 'chip' | 'drink' | 'chocolate') => {
        setSelectedTab(tab)
        if (tab === 'chip') {
            dispatch(selectChips(null));
            dispatch(selectDrink(null));
            dispatch(selectChocolate(null));
        } else if (tab === 'drink') {
            dispatch(selectChips(null));
            dispatch(selectDrink(null));
            dispatch(selectChocolate(null));

        } else if (tab === 'chocolate') {
            dispatch(selectChips(null));
            dispatch(selectDrink(null));
            dispatch(selectChocolate(null));
        }
    };



    return (
        <div className={'combo_page'}>
            <h1>Combo Deals</h1>
            <p>Select your combo:</p>
            <table>
                <thead>
                <tr className="tabs">
                    <th className={`tab ${selectedTab === 'chip' ? 'active' : ''}`} onClick={() => handleTabClick('chip')}>Chips</th>
                    <th className={`tab ${selectedTab === 'drink' ? 'active' : ''}`} onClick={() => handleTabClick('drink')}>Drinks</th>
                    <th className={`tab ${selectedTab === 'chocolate' ? 'active' : ''}`} onClick={() => handleTabClick('chocolate')}>Chocolates</th>
                </tr>
                </thead>
                <tbody>
                {loader ? <tr>
                        <td colSpan={3}>
                            <CustomLoader />
                        </td>
                    </tr>:
                    <tr>
                        <td>
                            <CustomLabel data={uniqueChips} handleOptionChange={handleOptionChange} type={'chip'} value={chips}/>
                        </td>
                        <td>
                            <CustomLabel data={uniqueDrinks} handleOptionChange={handleOptionChange} type={'drink'} value={drink}/>
                        </td>
                        <td>
                            <CustomLabel data={uniqueChocolates} handleOptionChange={handleOptionChange} type={'chocolate'} value={chocolate}/>
                        </td>
                    </tr>
                }

                </tbody>
            </table>

            {chips && drink && chocolate && (
                <div className={'selected_combo'}>
                    <h2>Selected Combo</h2>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                Chips
                            </td>
                            <td>
                                {chips}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Drink
                            </td>
                            <td>
                                {drink}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Chocolate
                            </td>
                            <td>
                                {chocolate}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button onClick={() => {
                        updateUniqueOptions()
                        dispatch(resetCombo())
                    }}>Change Combo</button>
                </div>
            )}
        </div>
    );
};

export default ComboPicker;
