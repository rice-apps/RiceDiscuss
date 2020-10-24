import React, { useState, useEffect, useCallback } from 'react'

import { useLazyQuery, useMutation } from '@apollo/client'
import log from 'loglevel'

import {
  Descriptor,
  LogoutButton,
  ProfileInner,
  ProfileLogout,
  Divider,
  RightSidebarContainer,
  Headshot,
  EditButton,
  BlockyText,
  TextBlock,
  SaveButton,
  EditableTextBlock,
  CloseButton,
  RightSidebar,
  DDList,
  DDListItem,
  UsernameEditable,
  AddPhotoButton,
  SavedPostsContainer
} from './Profile.styles'

import EditUrl from '../images/edit.svg'
import HeadshotUrl from '../images/headshot.svg'
import { Navigate } from 'react-router-dom'
import { currentUser, mainClient } from '../utils/apollo'
import { SET_INFO } from '../graphql/Mutations'
import { USER_EXISTS } from '../graphql/Queries'
import majorMinorJson from '../utils/MajorMinor.json'
import DropDownItem from './DropDownItem'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import AddIcon from '@material-ui/icons/Add'
import SearchBar from './Search'
// import {FieldSetStyle, TextField} from "./MoreInfo.styles";
import ImageUploader from './ImageUploader'

const validator = require('validator')

const ProfilePane = props => {
  const [userStatement, setStatement] = useState('Valid!')
  const [originalUsername, setOriginal] = useState('')
  const [username, setUsername] = useState('')

  const [imgUploaderVisible, setImgUploaderVisible] = useState(false)
  const [imageUrl, setImageUrl] = useState(HeadshotUrl)

  // current major, minors, and college
  const [major, setMajor] = useState([])
  const [minor, setMinor] = useState([])
  const [college, setCollege] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [savedPosts, setSavedPosts] = useState([])

  // if the drop_down is open
  const [beingEdited, setBeingEdited] = useState('none')
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [showStatement, setShowStatement] = useState(false)

  const [majorSearchActivated, setMajorsActive] = useState(false)
  const [minorSearchActivated, setMinorsActive] = useState(false)
  const [filteredMajors, setFilteredMajors] = useState([])
  const [filteredMinors, setFilteredMinors] = useState([])

  const { netID } = currentUser()
  const [addInfo] = useMutation(SET_INFO)

  const [
    checkUser,
    { data: userExists, loading: userExistLoading }
  ] = useLazyQuery(USER_EXISTS)

  const getData = () => {
    const {
      username: currentUsername,
      major: currentMajor,
      minor: currentMinor,
      college: currentCollege,
      email: currentEmail,
      phone: currentPhone,
      imageUrl: currentUrl,
      savedPosts: currentSavedPosts
    } = currentUser()
    const newUsername = username.length === 0 ? currentUsername : username
    setOriginal(newUsername)
    setUsername(currentUsername)
    setMajor(currentMajor)
    setMinor(currentMinor)
    setCollege(currentCollege)
    setEmail(currentEmail)
    setPhone(currentPhone)
    setImageUrl(currentUrl)
    setSavedPosts(currentSavedPosts)
  }

  useEffect(getData, [currentUser()])

  useEffect(() => {
    checkUser({
      variables: {
        username
      }
    })
  }, [username])

  useEffect(() => {
    const isMyUsernameTaken = userExists?.doesUsernameExist
    setStatement('valid username!')
    if (isMyUsernameTaken) {
      setStatement('somebody already took that username')
    }
    if (originalUsername === username) {
      setStatement('this is your current username')
    }
  }, [userExists])

  const majors = majorMinorJson.majors.split(';')

  const finalizedMajors = majorSearchActivated ? filteredMajors : majors

  const minors = majorMinorJson.minors.split(';')

  const finalizedMinors = minorSearchActivated ? filteredMinors : minors

  const colleges = majorMinorJson.colleges.split(';')

  const handleEditClick = source => {
    if (source === beingEdited) {
      setBeingEdited('none')
    } else {
      setBeingEdited(source)
    }
    setShowSaveButton(true)

    if (beingEdited === 'username') {
      setShowStatement(true)
    }

    switch (source) {
      case 'email':
        setEmail(document.getElementById('email').innerText)
        break
      case 'username':
        setUsername(document.getElementById('username').innerText)
        break
      default:
        log.info('Not supposed to happen')
    }
  }

  const checkForEnter = e => {
    if (e.keyCode === 13) {
      e.preventDefault()

      switch (beingEdited) {
        case 'email':
          setEmail(document.getElementById('email').innerText)
          break
        case 'username':
          setUsername(document.getElementById('username').innerText)
          setShowStatement(true)
          break
        default:
          log.info("This isn't supposed to happen")
      }

      setBeingEdited('none')
      e.target.value = ''

      setEmail(document.getElementById('email').innerText)
    }
  }

  // if I wrap this in useCallback, it breaks
  const handleMajorChange = newValue => {
    const indexOfMajor = major.indexOf(newValue)
    setMajor(
      indexOfMajor >= 0
        ? major.filter(maj => newValue !== maj)
        : [...major, newValue]
    )
  }

  const handleMinorChange = newValue => {
    const indexOfMinor = minor.indexOf(newValue)
    setMinor(
      indexOfMinor >= 0
        ? minor.filter(maj => newValue !== maj)
        : [...minor, newValue]
    )
  }

  const handleCollegeChange = useCallback(newValue => {
    const indexOfCollege = college.indexOf(newValue)
    setCollege(indexOfCollege >= 0 ? '' : newValue)
  }, [])

  const saveData = () => {
    const typedUsername = document.getElementById('username').innerText

    if (username !== typedUsername) {
      setUsername(typedUsername)
      return
    }

    if (
      userExistLoading ||
      (userExists?.doesUsernameExist && originalUsername !== username)
    ) {
      setStatement('someone got this name before you :(')
      setShowStatement(true)

      return
    }

    const attemptedEmail = document.getElementById('email').innerText.trim()
    const attemptedPhone = document.getElementById('phone').innerText.trim()

    if (attemptedEmail && !validator.isEmail(attemptedEmail)) {
      alert(attemptedEmail + ' is not a valid email address')
      return
    }

    if (attemptedPhone && !validator.isMobilePhone(attemptedPhone)) {
      alert(attemptedPhone + ' is not a valid phone number')
      return
    }

    try {
      addInfo({
        variables: {
          username,
          college,
          major,
          minor,
          netID,
          email: attemptedEmail || '',
          phone: attemptedPhone || '',
          isNewUser: false,
          imageUrl
        }
      }).then(() => {
        setShowSaveButton(false)
        setShowStatement(false)
        setBeingEdited('none')
      })
    } catch (error) {
      alert(error)
    }
  }

  if (currentUser() === {}) {
    return <Navigate to='/login' />
  }

  const handleLogout = async () => {
    window.localStorage.clear()
    mainClient
      .clearStore()
      .then(() =>
        window.open('https://idp.rice.edu/idp/profile/cas/logout', '_self')
      )
  }

  return props.show ? (
    <RightSidebarContainer>
      <CloseButton onClick={props.close}>
        <ChevronRightIcon
          style={{ width: '4.5vh', height: '4.5vh', color: '#FFFFFF' }}
        />
      </CloseButton>
      <RightSidebar>
        <ProfileLogout>
          <b style={{ fontSize: '3.7vh' }}>Profile</b>

          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </ProfileLogout>
        <ProfileInner>
          <Headshot src={imageUrl}>
            <AddPhotoButton
              onClick={() => {
                setImgUploaderVisible(!imgUploaderVisible)
                setShowSaveButton(true)
              }}
            >
              <AddIcon
                style={{ width: '2.7vh', height: '2.7vh', color: 'white' }}
              />
            </AddPhotoButton>
          </Headshot>
          <ImageUploader
            parentUrlCallback={url => {
              if (url) {
                setImageUrl(url)
              }
            }}
            show={imgUploaderVisible}
            handleDismissSelf={() => {
              setImgUploaderVisible(false)
            }}
          />
          <Descriptor
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <UsernameEditable
              contentEditable={beingEdited === 'username'}
              id='username'
              style={
                beingEdited === 'username'
                  ? { backgroundColor: '#FCE8DA' }
                  : { fontWeight: 'bold' }
              }
              onKeyDown={checkForEnter}
            >
              {username}
            </UsernameEditable>
            <EditButton
              src={EditUrl}
              onClick={() => handleEditClick('username')}
            />
            {showStatement && (
              <div
                style={{
                  position: 'absolute',
                  top: '3vh',
                  backgroundColor: '#F5F7FC',
                  paddingLeft: '0.25em',
                  paddingRight: '0.25em',
                  borderRadius: '0.5vh',
                  zIndex: '30'
                }}
              >
                {userStatement}
              </div>
            )}
          </Descriptor>
          <Divider />
          <Descriptor>
            <BlockyText>
              <b> Major: </b>
              <TextBlock>{major.join(', ')}</TextBlock>
            </BlockyText>
            <EditButton
              src={EditUrl}
              onClick={() => handleEditClick('major')}
            />
            {beingEdited === 'major' && (
              <div
                style={{
                  width: 'calc(35vh - 1.2em)',
                  position: 'fixed',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: '30'
                }}
              >
                <SearchBar
                  style={{
                    width: '23.5vh',
                    padding: '0.4vh 0.4vh',
                    fontSize: '2vh',
                    alignSelf: 'flex-end'
                  }}
                  items={majors}
                  setList={setFilteredMajors}
                  setActive={setMajorsActive}
                />
                <DDList style={{ position: 'relative', top: '-2.2vh' }}>
                  {finalizedMajors.map(item => (
                    <DDListItem key={item}>
                      <DropDownItem
                        name={item}
                        setInfo={handleMajorChange}
                        selectedItems={major}
                      />
                    </DDListItem>
                  ))}
                </DDList>
              </div>
            )}
          </Descriptor>
          <Descriptor>
            <BlockyText>
              <b> Minor: </b>
              <TextBlock> {minor.join(', ')} </TextBlock>
            </BlockyText>
            <EditButton
              src={EditUrl}
              onClick={() => handleEditClick('minor')}
            />
            {beingEdited === 'minor' && (
              <div
                style={{
                  width: 'calc(35vh - 1.2em)',
                  position: 'fixed',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: '30'
                }}
              >
                <SearchBar
                  style={{
                    width: '23.5vh',
                    padding: '0.4vh 0.4vh',
                    fontSize: '2vh',
                    alignSelf: 'flex-end'
                  }}
                  items={minors}
                  setList={setFilteredMinors}
                  setActive={setMinorsActive}
                />
                <DDList style={{ position: 'relative', top: '-2.2vh' }}>
                  {finalizedMinors.map(item => (
                    <DDListItem key={item}>
                      <DropDownItem
                        name={item}
                        setInfo={handleMinorChange}
                        selectedItems={minor}
                      />
                    </DDListItem>
                  ))}
                </DDList>
              </div>
            )}
          </Descriptor>
          <Descriptor>
            <BlockyText>
              <b> College: </b>
              <TextBlock> {college.replace('_', ' ')} </TextBlock>
            </BlockyText>
            <EditButton
              src={EditUrl}
              onClick={() => handleEditClick('college')}
            />
            {beingEdited === 'college' && (
              <div
                style={{
                  width: 'calc(35vh - 1.2em)',
                  position: 'fixed',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: '30',
                  paddingTop: '1vh'
                }}
              >
                <DDList>
                  {colleges.map(item => (
                    <DDListItem key={item}>
                      <DropDownItem
                        name={item}
                        alias={item.replace('_', ' ')}
                        setInfo={handleCollegeChange}
                        selectedItems={college}
                      />
                    </DDListItem>
                  ))}
                </DDList>
              </div>
            )}
          </Descriptor>
          <Divider />
          <Descriptor>
            <BlockyText>
              <b> Email: </b>
              <EditableTextBlock
                contentEditable={beingEdited === 'email'}
                id='email'
                onChange={text => setEmail(text)}
                style={
                  beingEdited === 'email'
                    ? { backgroundColor: '#FCE8DA' }
                    : null
                }
                onKeyDown={checkForEnter}
              >
                <a href={beingEdited === 'email' ? null : 'mailto:' + email}>
                  {email}
                </a>
              </EditableTextBlock>
            </BlockyText>
            <EditButton
              src={EditUrl}
              onClick={() => handleEditClick('email')}
            />
          </Descriptor>
          <Descriptor>
            <BlockyText>
              <b> Phone: </b>
              <EditableTextBlock
                contentEditable={beingEdited === 'phone'}
                id='phone'
                value={phone}
                style={
                  beingEdited === 'phone'
                    ? { backgroundColor: '#FCE8DA' }
                    : null
                }
                onKeyDown={checkForEnter}
              >
                {phone}
              </EditableTextBlock>
            </BlockyText>
            <EditButton
              src={EditUrl}
              onClick={() => handleEditClick('phone')}
            />
          </Descriptor>
          <Divider />
          {showSaveButton && (
            <SaveButton onClick={() => saveData()}>Save</SaveButton>
          )}
          {showSaveButton && <Divider />}
        </ProfileInner>
        <b style={{ fontSize: '2.2vh' }}>Saved posts:</b>
        {savedPosts.length && (
          <SavedPostsContainer style={{ fontSize: '2.2vh' }}>
            {savedPosts.map(post => (
              <div key={post._id} style={{ fontSize: 'inherit' }}>
                <a
                  href={'/posts/' + post._id}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ fontSize: 'inherit' }}
                >
                  {post._id}
                </a>
              </div>
            ))}
          </SavedPostsContainer>
        )}
      </RightSidebar>
    </RightSidebarContainer>
  ) : null
}

export default ProfilePane
