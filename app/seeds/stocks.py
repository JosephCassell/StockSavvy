from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text


def seed_stocks():
    gme = Stock(name='Gamestop', symbol='GME', current_price=14.90, company_info='GameStop Corp. offers games and entertainment products through its ecommerce properties and stores. It operates through the following geographic segments: United States, Canada, Australia, and Europe.')
    aapl = Stock(name='Apple', symbol='AAPL', current_price=171.20, company_info='Apple, Inc. engages in the design, manufacture, and sale of smartphones, personal computers, tablets, wearables and accessories, and other varieties of related services. It operates through the following geographical segments: Americas, Europe, Greater China, Japan, and Rest of Asia Pacific.')
    tsla = Stock(name='Tesla', symbol='TSLA', current_price=168.16, company_info='Tesla, Inc. engages in the design, development, manufacture, and sale of electric vehicles and energy generation and storage systems. The company operates through Automotive and Energy Generation and Storage.')
    nflx = Stock(name='Netflix', symbol='NFLX', current_price=610.76, company_info='Netflix, Inc. engages in providing entertainment services. It also offers activities for leisure time, entertainment video, video gaming, and other sources of entertainment.')
    meta = Stock(name='Meta Platforms', symbol='META', current_price=494.80, company_info='Meta Platforms, Inc. engages in the development of social media applications. It builds technology that helps people connect and share, find communities, and grow businesses.')
    msft = Stock(name='Microsoft', symbol='MSFT', current_price=416.69, company_info='Microsoft Corp. engages in the development and support of software, services, devices, and solutions. It operates through the following business segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.')
    gpro = Stock(name='GoPro', symbol='GPRO', current_price=2.22, company_info='GoPro, Inc. engages in manufacturing and selling cameras and camera accessories. It provides mountable and wearable cameras and accessories, which it refers to as capture devices.')
    sbux = Stock(name='Starbucks', symbol='SBUX', current_price=91.85, company_info='Starbucks Corp. engages in the production, marketing, and retailing of specialty coffee. It operates through the following segments: North America, International, Channel Development, and Corporate and Other.')
    ge = Stock(name='GE', symbol='GE', current_price=170.00, company_info='General Electric Co. engages in the provision of commercial and military aircraft engines and systems, wind, and other renewable energy generation equipment and grid solutions, and gas, steam, nuclear, and other power generation equipment. It operates through the following segments: Aviation, Renewable Energy, and Power.')
    nok = Stock(name='Nokia', symbol='NOK', current_price=3.67, company_info='Nokia Oyj engages in the provision of network infrastructure, technology, and software services. It operates through the following segments: Mobile Networks, Network Infrastructure, Cloud and Network Services, and Nokia Technologies.')
    jpm = Stock(name='JPMorgan Chase', symbol='JPM', current_price=191.73, company_info='JPMorgan Chase & Co. is a financial holding company, which engages in the provision of financial and investment banking services. The firm offers a range of investment banking products and services in all capital markets, including advising on corporate strategy and structure, capital raising in equity and debt markets, risk management, market making in cash securities and derivative instruments, and brokerage and research.')
    wmt = Stock(name='Walmart', symbol='WMT', current_price=61.57, company_info='Walmart, Inc. engages in retail and wholesale business. The company offers an assortment of merchandise and services at everyday low prices. ')
    bac = Stock(name='Bank of America', symbol='BAC', current_price=36.44, company_info='Bank of America Corp. is a bank and financial holding company, which engages in the provision of banking and nonbank financial services. It operates through the following segments: Consumer Banking, Global Wealth and Investment Management (GWIM), Global Banking, Global Markets, and All Other. ')
    wfc = Stock(name='Wells Fargo', symbol='WFC', current_price=58.44, company_info='Wells Fargo & Co. is a diversified, community-based financial services company. It is engaged in the provision of banking, insurance, investments, mortgage products and services, and consumer and commercial finance.')
    low = Stock(name='Lowes', symbol='LOW', current_price=248.55, company_info='Lowe\'s Companies, Inc. engages in the retail sale of home improvement products. The firm offers products for maintenance, repair, remodeling, home decorating and property maintenance.')
    pg = Stock(name='Procter & Gamble', symbol='PG', current_price=162.30, company_info='Procter & Gamble Co. engages in the provision of branded consumer packaged goods. It operates through the following segments: Beauty, Grooming, Health Care, Fabric and Home Care, and Baby, Feminine and Family Care.')
    siegy = Stock(name='Siemens', symbol='SIEGY', current_price=100.64, company_info='Siemens AG is a technology company, which engages in the areas of automation and digitalization. It operates through the following segments: Digital Industries, Smart Infrastructure, Mobility, Siemens Healthineers, and Siemens Financial Services.')
    pgr = Stock(name='Progressive', symbol='PGR', current_price=199.98, company_info='Progressive Corp. is an insurance holding company, which engages in the provision of personal and commercial auto insurance, residential property insurance, and other specialty property-casualty insurance and related services. It operates through the following segments: Personal Lines, Commercial Lines, and Property.')
    wm = Stock(name='Waste Management', symbol='WM', current_price=211.00, company_info='Waste Management, Inc. is a holding company, which engages in the provision of waste management environmental services. It operates through the following segments: Collection and Disposal-East Tier (East Tier), Collection and Disposal-West Tier (West Tier), Recycling Processing and Sales, WM Renewable Energy, and Corporate and Other.')
    cmg = Stock(name='Chipotle', symbol='CMG', current_price=2722.69, company_info='Chipotle Mexican Grill, Inc. engages in the business of developing and operating restaurants that serve a relevant menu of burritos, burrito bowls, quesadillas, tacos, and salads made using fresh, high-quality ingredients. The company was founded by Steve Ells in 1993 and is headquartered in Newport Beach, CA.')
    cl = Stock(name='Colgate', symbol='CL', current_price=89.41, company_info='Colgate-Palmolive Co. engages in the manufacturing and distribution of consumer products. It operates through the Oral, Personal, and Home Care and Pet Nutrition segments.')
    mar = Stock(name='Marriott International', symbol='MAR', current_price=252.00, company_info='Marriott International, Inc. engages in the operation and franchise of hotel, residential, and timeshare properties. Its brands include Marriott Bonvoy, The Ritz-Carlton, Edition, W Hotels Worldwide, The Luxury Collection, Stregis Hotels and Resorts, JW Marriott, Bvlgari Hotels and Resorts, Sherton, Marriott, Marriott Vacation Club, Delta Hotels Marriott, Westin Hotels and Resorts, Le Meridien, Renaissance Hotels, Autograph Collection Hotels, Tribute Portfolio, Design Hotels, Gaylord Hotels, Courtyard, Springhill Suites, Four Points by Sheraton, Fairfield, Protea Hotels, AC Hotels Marriott, aloft Hotels, Moxy Hotels, City Express, ResidenceINN, Towneplaces Suites, Marriott Executive Apartments, and element.')
    orly = Stock(name='O\'Reilly Auto Parts', symbol='ORLY', current_price=1101.40, company_info='O\'Reilly Automotive, Inc. owns and operates retail outlets in the United States. It engages in the distribution and retailing of automotive aftermarket parts, tools, supplies, equipment, and accessories in the U.S., serving both professional installers and do-it-yourself customers.')
    mnst = Stock(name='Monster', symbol='MNST', current_price=62.55, company_info='Monster Beverage Corp. is a holding company, which engages in the development, marketing, sale, and distribution of energy drink beverages and concentrates. It operates through the following segments: Monster Energy Drinks, Strategic Brands, and Other.')
    msi = Stock(name='Motorola Solutions', symbol='MSI', current_price=343.68, company_info='Motorola Solutions, Inc. engages in the provision of communication infrastructure, devices, accessories, software, and services. It operates through the following segments: Products and Systems Integration, and Software and Services.')
    cof = Stock(name='Capital One', symbol='COF', current_price=140.61, company_info='Capital One Financial Corp. operates as a financial holding company. The firm engages in the provision of financial products and services.')
    hlt = Stock(name='Hilton Worldwide', symbol='HLT', current_price=209.00, company_info='Hilton Worldwide Holdings, Inc. engages in the provision of hospitality businesses. It operates through the Management and Franchise, and Ownership segments.')
    rycey = Stock(name='Rolls-Royce', symbol='RYCEY', current_price=5.01, company_info='Rolls-Royce Holdings Plc designs, develops, manufactures, and services integrated power systems for use in the air, on land, and at sea. The company operates its business through following segments: Civil Aerospace, Power Systems, Defense and ITP Aero.')
    addyy = Stock(name='Adidas', symbol='ADDYY', current_price=109.52, company_info='adidas AG engages in the design, distribution, and marketing of athletic and sporting lifestyle products. It operates through the following geographical segments: EMEA, North America, Greater China, Asia-Pacific, Latin America, and Other Businesses.')
    ebay = Stock(name='eBay', symbol='EBAY', current_price=52.51, company_info='eBay, Inc. is a commerce company, whose platforms include an online marketplace and its localized counterparts, including off-platform businesses in South Korea, Japan, and Turkey, as well as eBay’s suite of mobile apps. Its technologies and services are designed to give buyers choice and a breadth of relevant inventory and to enable sellers worldwide to organize and offer their inventory for sale, virtually anytime and anywhere.')

    db.session.add(gme)
    db.session.add(aapl)
    db.session.add(tsla)
    db.session.add(nflx)
    db.session.add(meta)
    db.session.add(msft)
    db.session.add(gpro)
    db.session.add(sbux)
    db.session.add(ge)
    db.session.add(nok)
    db.session.add(jpm)
    db.session.add(wmt)
    db.session.add(bac)
    db.session.add(wfc)
    db.session.add(low)
    db.session.add(pg)
    db.session.add(siegy)
    db.session.add(pgr)
    db.session.add(wm)
    db.session.add(cmg)
    db.session.add(cl)
    db.session.add(mar)
    db.session.add(orly)
    db.session.add(mnst)
    db.session.add(msi)
    db.session.add(cof)
    db.session.add(hlt)
    db.session.add(rycey)
    db.session.add(addyy)
    db.session.add(ebay)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))

    db.session.commit()
